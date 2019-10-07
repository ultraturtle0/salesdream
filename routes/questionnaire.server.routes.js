var Link = require('mongoose').model('Link');
var validate_token = require('../config/strategies/jwt')([]);
var tracker = require('../util/tracker');
var { ledger, questionnaire } = require('../controllers/API/toolkit.js');
var validate_Link = require('../util/validate_link');


module.exports = (app) => {
    app.route('/questionnaire/:link')
        .get(validate_Link('link'), tracker.open('questionnaire'), (req, res) => res.render('questionnaire', { id: req.body.link, name: req.body.companyName }));
    app.route('/api/questionnaire')
        .get(questionnaire.get);
        //.post(questionnaire.post);
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger.post);
    /*app.route('/ledger')
     *  .get(validate_token, (req, res) => res.render('ledger'));
     */
}
