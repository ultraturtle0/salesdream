const uuid = require('uuid/v4');

const User = require('mongoose').model('User');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = (req, res, next) => 
    passport.authenticate('local', 
        {
            session: false,
            failureFlash: true
        },
        (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.redirect('/login');
            req.logIn(user, (err) => {
                if (err) return next(err);
                const tempkey = uuid();

                // Build the JWT payload
                const payload = {
                    sub: user.username,
                    perms: 'GET POST',
                    iss: config.passport.issuer,
                    tempkey: tempkey
                };
                const token = jwt.sign(payload, config.passport.secret, { expiresIn: '60m' });
                User.findOneAndUpdate({_id: user._id}, {$set: { tempkey }})
                    .exec()
                    .then((doc) => {
                        console.log(token);
                        res.cookie('apikey', token, { expires: new Date(Date.now() + 3600000), httpOnly: true });
                        res.redirect('/');
                    })
                    .catch((err) => {
                        req.flash('error', 'Error saving temporary token');
                        console.log(err);
                        res.redirect('/login');
                    });
            });
        }
    )(req, res, next);

