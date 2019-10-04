var validate_token = require('../config/strategies/jwt');
var { ledger } = require('../controllers/API/toolkit.js');

module.exports = (app) => {
    app.route('/ledger')
        .get((req, res) => res.render('ledger'));
        //.post(ledger.post);
    app.route('/api/ledger/create')
        .post(validate_token('POST'), ledger.gen);
    app.route('/contracts')
        .get((req, res) => res.render('contracts'));
}
