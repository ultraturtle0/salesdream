var validate_token = require('../config/strategies/jwt')([]);
var tracker = require('../util/tracker');
var { ledger, questionnaire } = require('../controllers/API/toolkit.js');
var validate_Link = require('../util/validate_link');

module.exports = (app) => {
    const api_key = app.get('api_key');

    app.route('/questionnaire/:link')
        .get(validate_Link('link'), tracker.open('questionnaire'), (req, res) => {
            res.render('questionnaire', { link: req.body.link });
        })
        .post(validate_Link('link'), tracker.complete('questionnaire'), questionnaire(api_key).post);
    app.route('/api/questionnaire')
        .get(validate_Link('link'), questionnaire(api_key).get);
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger(api_key).post);
};
