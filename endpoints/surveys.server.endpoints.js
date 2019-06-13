const surveys = require('../controllers/surveys.server.controller');

const routes = ['QBO', 'newHire', 'newClient'];

var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/QBOtest')
        .get(validate_token, (req, res) => res.render('test'));
}
