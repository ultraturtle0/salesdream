const forms = require('../controllers/forms.server.controller');
const login = require('../util/login.js');
const uuid = require('uuid/v4');

const User = require('mongoose').model('User');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const sf = require('../apps/salesforce');

const validate_token = require('../config/strategies/jwt.js');

module.exports = (app) => {

    // pages
    app.route('/login')
        .get((req, res, next) => {
            if (req.cookies.apikey) return res.redirect('/')
                else next();
        }, forms['login'])
        .post(login);

    app.route('/')
        .get(validate_token, (req, res) => res.render('home'));
 
    app.route('/hiring')
        .get(validate_token, (req, res) => res.render('hiring'));

    app.route('/introduction')
        .get(validate_token, (req, res) => res.render('introduction'));
    
    app.route('/onboarding')
        .get(validate_token, (req, res) => res.render('onboarding'));

    // API routes
    app.route('/api/hiring')
        .post(validate_token, forms['hiring']);

    app.route('/api/introduction')
        .get(validate_token, forms['introduction'].get)
        .post(validate_token, forms['introduction'].post);

    app.route('/api/onboarding')
        .get(validate_token, forms['onboarding'].get)
        .post(validate_token, forms['onboarding'].post);
}

