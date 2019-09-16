var validate_token = require('../config/strategies/jwt')('GET');
var { ledger } = require('../controllers/API/toolkit.js');

module.exports = (app) => {
    app.route('/ledger')
        .get((req, res) => res.render('ledger'));
    app.route('/api/ledger')
        .get(validate_token, ledger.get)
        .post(validate_token, ledger.post);
    app.route('/contracts')
        .get((req, res) => res.render('contracts'));
}
