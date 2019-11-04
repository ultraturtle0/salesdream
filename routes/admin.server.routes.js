var validate_token = require('../config/strategies/jwt')('ADMIN');
var axios = require('axios');

module.exports = (app) => {
    app.route('/admin')
        .get(validate_token, (req, res) => res.render('admin'))
        .post(validate_token, (req, res) => {});
};
