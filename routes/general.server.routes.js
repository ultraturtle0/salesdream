var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/thankyou')
        .get((req, res) => res.render('thankyou'));

}
