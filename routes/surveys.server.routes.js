const surveys = require('../controllers/surveys.server.controller');

var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/QBOtest')
        .get(validate_token('POST'), (req, res) => res.render('test'));

    app.route('/SOW')
        .get(validate_token, (req, res) => res.render('scope_of_work'));
}
