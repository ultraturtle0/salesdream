var validate_token = require('../config/strategies/jwt');
var validate_Link = require('../util/validate_link');
var inject_API = require('../util/inject_API');
var { ledger } = require('../controllers/API/toolkit.js');
var links = require('../controllers/API/links.js');
var calendar = require('../controllers/API/calendar.js');
var tracker = require('../util/tracker');

module.exports = (app) => {
    const api_key = app.get('api_key');

    app.route('/ledger')
        .get((req, res) => res.render('ledger'));
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger(api_key).post);
    app.route('/api/ledger/create')
        .post(validate_token('POST'), ledger(api_key).gen);
    
    app.route('/explorer')
        .get((req, res) => res.render('explorer'));
    app.route('/api/link')
        .get(inject_API(app), links(api_key).get);
    app.route('/api/calendar/create')
        .post(validate_token('POST'), calendar(api_key).post);
    app.route('/contracts')
        .get((req, res) => res.render('contracts'));
}
