var validate_token = require('../config/strategies/jwt');
var { ledger } = require('../controllers/API2/toolkit.js');
var sr = require('../controllers/API2/contracts.js');

module.exports = (app) => {
    app.route('/api/toolkit/ledger')
        .get(ledger.get);

    app.route('/api/contracts')
        .post(sr.post);
}
