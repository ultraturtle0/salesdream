const passport = require('passport');

var auth = passport.authenticate('local', {
    success_redirect: '/hiring',
    failure_redirect: '/login',
    failure_flash: true
});

module.exports = {
    auth: auth,
}
