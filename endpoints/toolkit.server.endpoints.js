var validate_token = require('../config/strategies/jwt');
var ledger = require('../controllers/ledger.server.controller.js');

module.exports = (app) => {
    app.route('/ledger')
        .get(validate_token, (req, res) => res.render('ledger'));

    app.route('/api/ledger')
        .get(validate_token, ledger.get)
        .post(validate_token, ledger.post);

}