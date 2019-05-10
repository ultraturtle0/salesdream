const passport = require('passport');
var introduction = require('./API/introduction');
var hiring = require('./API/hiring');
var onboarding = require('./API/onboarding');

var auth = passport.authenticate('local', {
    success_redirect: '/hiring',
    failure_redirect: '/login',
    failure_flash: true
});

module.exports = {

    onboarding: onboarding,
    introduction: introduction,
    hiring: hiring,

    login: ((req, res) => res.render('login', { messages: req.flash('error') || req.flash('info') || 'default'})),
    auth: auth,


    webhook_approval: (req, res, next) => {
        res.status(200).json({data: 'ok'});
    },

/*    QBOtest: (req, res, next) => {
        res.render('QBOtest', {});
    }
    */
}
