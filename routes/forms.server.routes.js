const introduction = require('../controllers/API/introduction');
const hiring = require('../controllers/API/hiring');
const calendar = require('../controllers/API/calendar');
const leads = require('../controllers/API/leads');
const links = require('../controllers/API/links');
const picklists = require('../controllers/API/picklists');
const uuid = require('uuid/v4');

const User = require('mongoose').model('User');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const sf = require('../apps/salesforce');

const validate_token = require('../config/strategies/jwt.js');
const validate_Link = require('../util/validate_link.js');

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
                    perms: user.perms.join(' '),
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
    // initialize API keys for routes
    const api_key = app.get('api_key');

    app.route('/')
        .get(validate_token('GET'), (req, res) => res.render('home'));
    app.route('/leads')
        .get(validate_token('GET'), leads(api_key).get);
    app.route('/links/:_id')
        //.get(validate_token('GET'), validate_Link('_id'), links(api_key).get);
        .get(validate_token('GET'), links(api_key).get);
 
    app.route('/hiring')
        .get(validate_token('GET'), (req, res) => res.render('hiring'));
    // ERROR WITH SIGNREQUEST
    app.route('/api/hiring')
        .post(validate_token('POST'), hiring);

    app.route('/introduction')
        .get(validate_token('GET'), (req, res) => res.render('introduction'))
        .post(validate_token('GET'), calendar(api_key).post, introduction(api_key).post);


    // DEPRECATED 
    /*app.route('/api/onboarding')
        .get(validate_token, forms['onboarding'].get)
        .post(validate_token, forms['onboarding'].post);
    */
    app.route('/login') 
        .get((req, res, next) => { 
            if (req.cookies.apikey) 
                return res.redirect('/') 
            else next();
        }, (req, res) => res.render('login', { messages: req.flash('error') || req.flash('info') || 'default'}))
        .post(login);

    // DEPRECATED
    /*app.route('/onboarding')
        .get(validate_token, (req, res) => res.render('onboarding'));
        */

}

