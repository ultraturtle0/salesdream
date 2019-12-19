var Link = require('mongoose').model('Link');
var validate_token = require('../config/strategies/jwt')([]);
var tracker = require('../util/tracker');
var { ledger, questionnaire } = require('../controllers/API/toolkit.js');
var validate_Link = require('../util/validate_link');
var inject_API = require('../util/inject_API');


module.exports = (app) => {
    app.route('/questionnaire/:link')
        .get(validate_Link('link'), tracker.open('questionnaire'), (req, res) => {
            res.render('questionnaire', { link: req.body.link });
        })
        .post(validate_Link('link'), tracker.complete('questionnaire'), questionnaire.post);
    app.route('/api/questionnaire')
        .get(validate_Link('link'), inject_API, questionnaire.get);
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger.post);
}
