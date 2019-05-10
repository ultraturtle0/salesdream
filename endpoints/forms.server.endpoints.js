const forms = require('../controllers/forms.server.controller');
const uuid = require('uuid/v4');

const User = require('mongoose').model('User');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const sf = require('../apps/salesforce');

const validate_token = require('../config/strategies/jwt.js');

var login = (req, res, next) => 
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


module.exports = (app) => {
    app.route('/')
        .get((req, res) => {
            if (!req.cookies.apikey) return res.redirect('/login');
            res.render('home');
        });
 
    app.route('/hiring')
        .get(validate_token, (req, res) => res.render('hiring'));
    app.route('/api/hiring')
        .post(validate_token, forms['hiring']);

    app.route('/introduction')
        .get(validate_token, (req, res) => res.render('introduction'));

    app.route('/api/introduction')
        .get(validate_token, forms['introduction'].get)
        .post(validate_token, forms['introduction'].post);

    app.route('/api/onboarding')
        .get(validate_token, forms['onboarding'].get)
        .post(validate_token, forms['onboarding'].post);

    app.route('/login')
        .get((req, res, next) => {
            if (req.cookies.apikey) return res.redirect('/')
                else next();
        }, forms['login'])
        .post(login);

    app.route('/onboarding')
        .get(validate_token, (req, res) => res.render('onboarding'));

}

