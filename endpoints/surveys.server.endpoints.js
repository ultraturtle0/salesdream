const surveys = require('../controllers/surveys.server.controller');

const routes = ['QBO', 'newHire', 'newClient'];

var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    /*routes.forEach(route =>
        app.route('/' + route)
            .get(surveys.webhook_approval)
            .post(surveys[route])
    );
    */

    app.route('/QBOtest')
        .get(validate_token, (req, res) => res.render('test'));
}
