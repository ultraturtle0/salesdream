var validate_token = require('../config/strategies/jwt');
var { ledger } = require('../controllers/API/toolkit.js');
var calendar = require('../controllers/API/calendar.js');

module.exports = (app) => {
    app.route('/ledger')
        .get((req, res) => res.render('ledger'));
        //.post(ledger.post);
    app.route('/api/ledger/create')
        .post(validate_token('POST'), ledger.gen);
    app.route('/api/calendar/create')
        .post(validate_token('POST'), calendar.post, (req, res) => { console.log('we find this');
            res.status(200).send({})
        });
    app.route('/contracts')
        .get((req, res) => res.render('contracts'));
}
