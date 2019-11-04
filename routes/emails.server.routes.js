var validate_token = require('../config/strategies/jwt');
var templates = require('../config/emails/templates');
var email = require('../controllers/API/email');

module.exports = (app) => {
    app.route('/api/templates/:template')
        //.get(email.get)
        .post(email.post);
}
