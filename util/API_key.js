const jwt = require('jsonwebtoken');
const config = require('../config/config');
const uuid = require('uuid/v4');
const Key = require('mongoose').model('Key');

// expects "scopes" field in json body
var request = () =>
    (req, res, next) => {
        const scopes = req.body.scopes;
        const payload = {
            sub: 'server',
            scopes: scopes.join(', '),
            iss: `${config.API.protocol}//${config.API.domain}`,
            token: uuid()
        };
        var key = new Key({
            sub: payload.sub,
            token: payload.token,
            scopes
        });
        key.save()
            .then(new_key => {
                const API_key = jwt.sign(payload, config.API.secret);     
                return res.send({ key: API_key });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).send({ errors: ['Error generating new API key.', err] });
            });
    };

// expects "api_key" field in json body or as querystring
var verify = (perms) =>
    (req, res, next) => {
        var scopes;
        var token;
        var key = req.body.api_key || req.query.api_key;
        if (!key)
            res.status(500).send({ errors: ['API key missing.'] });
        jwt.verify(key, config.API.secret, (err, decoded) => {
            if (err) {
                console.log('Verification failure.');
                console.log(err)
                return res.status(500).send({ errors: ['Error generating new API key.', err] });
            };
            scopes = decoded.scopes;
            token = decoded.token;
        });
            
        Key.findOne({ token })
            .exec()
            .then(api_key => {
                if (!api_key || (api_key.token !== token)) {
                    var err = 'No API key found.';
                    console.log(err);
                    return res.status(500).send({ errors: [err] });
                };
                var illegal = [];
                perms.forEach((perm) => {
                    // check for global permissions, split by periods
                    var valid = false;
                    var old_pieces = [];
                    var new_scopes = perm
                        .split('.')
                        .reduce((acc, piece) => {
                            old_pieces.push(piece);
                            return [...acc, old_pieces.join('.')];
                        }, []);
                    api_key.scopes.forEach((scope) => {
                        if (new_scopes.includes(scope)) 
                            valid = true;
                    });
                    if (!valid)
                        illegal.push(perm);
                });
                if (illegal.length) {
                    var err = 'Insufficient permissions for API key: ' + illegal.join(', ');
                    console.log(err);
                    return res.status(500).send({ errors: [err] });
                };
                return next();
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).send({ errors: ['Error retrieving API key.', err] })
            });
    };

module.exports = {
    request,
    verify
};
            

                            
                    
                    


        
        
