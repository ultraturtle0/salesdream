var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/questionnaire/:id')
        .get((req, res) => res.render('questionnaire', {
            id: req.params.id

        }));

    //app.route('/api/questionnaire')
        //.post(validate_token, questionnaire.post);

}
