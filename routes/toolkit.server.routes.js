var validate_token = require('../config/strategies/jwt');
var { ledger } = require('../controllers/API/toolkit.js');
var link = require('../controllers/API/links.js');
var calendar = require('../controllers/API/calendar.js');
var tracker = require('../util/tracker');

module.exports = (app) => {
    app.route('/ledger')
        .get((req, res) => res.render('ledger'));
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger.post);
    app.route('/api/ledger/create')
        .post(validate_token('POST'), ledger.gen);
    
    app.route('/explorer')
        .get((req, res) => res.render('explorer'));
    app.route('/api/link')
        .get(inject_API, link.get);
    // PROBLEM
        //.get(validate_token('GET'), link.get);
    app.route('/api/calendar/create')
        .post(validate_token('POST'), calendar.post);
        //     res.status(200).send({})
        //});
    app.route('/contracts')
        .get((req, res) => res.render('contracts'));
}
