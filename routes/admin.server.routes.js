var validate_token = require('../config/strategies/jwt')('ADMIN');
var admin = require('../controllers/API/admin');

module.exports = (app) => {
    const api_key = app.get('api_key');

    app.route('/admin')
        .get(validate_token, (req, res) => res.render('admin'))
        .post(validate_token, (req, res) => {});

    app.route('/api/admin/:_id')
        .post(validate_token, admin(api_key).updatePerms);

    app.route('/api/admin')
        .get(validate_token, admin(api_key).get)
        .post(validate_token, admin(api_key).post);
};
