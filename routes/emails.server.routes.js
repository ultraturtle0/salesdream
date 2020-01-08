var validate_token = require('../config/strategies/jwt');
var templates = require('../config/emails/templates');
var email = require('../controllers/API/email');
var inject_API = require('../util/inject_API');

module.exports = (app) => {
    const api_key = app.get('api_key');

    app.route('/api/templates/:template')
        .post(email(api_key).post);
}
