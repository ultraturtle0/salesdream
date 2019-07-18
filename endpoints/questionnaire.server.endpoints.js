var validate_token = require('../config/strategies/jwt');
var questionnaire = require('../controllers/questionnaire.server.controller.js');

module.exports = (app) => {
    app.route('/questionnaire/:id')
        .get(validate_token, (req, res) => res.render('questionnaire', {
            id: req.params.id
        }));

    app.route('/api/questionnaire')
        .post(validate_token, questionnaire.post);

}
