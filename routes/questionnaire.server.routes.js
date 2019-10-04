var Link = require('mongoose').model('Link');
var validate_token = require('../config/strategies/jwt')([]);
var tracker = require('../util/tracker');
var { ledger } = require('../controllers/API/toolkit.js');
var validate_Link = require('../util/validate_link');

var questionnaire = require('../controllers/questionnaire.server.controller.js');

module.exports = (app) => {
    // generate client questionnaire link
    // IS THIS STILL NEEDED?
    /*app.route('/linkgen')
        .post(validate_token, questionnaire.gen);
        */

    app.route('/questionnaire/:link')
        .get(validate_Link('link'), tracker.open('questionnaire'), (req, res) => res.render('questionnaire', { id: req.body.link, name: req.body.companyName }));
    app.route('/ledger/:link')
        .get(validate_Link('ledgerLink'), tracker.open('ledger'), (req, res) => res.render('ledger', { id: req.body.ledgerLink, companyName: req.body.companyName }))
        .post(validate_Link('ledgerLink'), tracker.complete('ledger'), ledger.post);
    /*app.route('/ledger')
     *  .get(validate_token, (req, res) => res.render('ledger'));
     */
}
