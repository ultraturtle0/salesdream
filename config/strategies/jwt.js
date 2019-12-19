const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

module.exports = (perms) =>
    (req, res, next) => {
        var payload = req.cookies.apikey;
        var failure = (err) => {
            req.flash('error', err);
            console.log(err);
            res.redirect('/login');
        };

        if (!payload) return failure('Please log in.');

        jwt.verify(payload, config.passport.secret, function(err, decoded) {
            
            console.log(decoded);
            // check for verification error
            if (err) return failure('Invalid token format.');
            // check for incorrect issuer
            //if (decoded.iss !== config.passport.issuer) return failure('issuer');
            
            var query = {};
            // check for temporary or permanent api key
            if (decoded.apikey) query.apikey = decoded.apikey
                else query.tempkey = decoded.tempkey;

            
            User.findOne(query)
                .exec()
                .then(user => {
                    if (!user) return failure('Token registrant not recognized.');

                    // make permissions an array if only a single string
                    perms = Array.isArray(perms) ? perms : [perms];

                    // check if permissions are missing
                    var missing = perms.reduce((acc, perm) =>
                        user.perms.includes(perm) ? acc : acc.concat(perm), []);
                    missing.length ?
                        console.log(missing) || failure('Inadequate permissions for this endpoint - ' + missing.join(', ')) :
                        next();
                })
                .catch(err => {
                    console.log(err); 
                    res.status(500).send({ auth: false, message: 'Error looking up user - please try again momentarily.' })
                });
        });
    }; 
