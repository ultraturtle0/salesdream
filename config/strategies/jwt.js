const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

module.exports = (req, res, next) => {
    var payload = req.cookies.apikey;
    var failure = (err) => {
        req.flash('error', err);
        res.redirect('/login');
    };

    if (!payload) return failure('Please log in.');

    jwt.verify(payload, config.passport.secret, function(err, decoded) {
        

        // check for verification error
        if (err) return failure('Invalid token format.');
        // check for incorrect token permissions
        if (!decoded.perms.includes(req.method)) return failure('Failed to authenticate token.');
        // check for incorrect issuer
        if (decoded.iss !== config.passport.issuer) return failure('issuer');
        
        var query = {};
        // check for temporary or permanent api key
        if (decoded.apikey) query.apikey = decoded.apikey
            else query.tempkey = decoded.tempkey;

        User.findOne(query)
            .exec()
            .then(user => {
                if (!user) return failure('Token registrant not recognized.');
                if (!user.perms.includes(req.method)) return failure('Inadequate permissions for this endpoint.');
                console.log('validation successful!');
                next();
            })
            .catch(err => res.status(500).send({ auth: false, message: 'Error looking up user - please try again momentarily.' }));
    });
}; 
