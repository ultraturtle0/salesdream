var Link = require('mongoose').model('Link');
var validate_token = require('../config/strategies/jwt')([]);
var tracker = require('../util/tracker');
var { ledger, questionnaire } = require('../controllers/API/toolkit.js');
var validate_Link = require('../util/validate_link');


module.exports = (app) => {
    app.route('/questionnaire/:link')
        .get(validate_Link('link'), tracker.open('questionnaire'), (req, res) => {
            res.render('questionnaire', { link: req.body.link });
        })
        .post(validate_Link('link'), tracker.complete('questionnaire'), questionnaire.post);
    app.route('/api/questionnaire')
        .get(questionnaire.get);
    /*app.route('/ledger')
     *  .get(validate_token, (req, res) => res.render('ledger'));
     */
}
