var validate_token = require('../config/strategies/jwt');
var templates = require('../config/emails/templates');

module.exports = (app) => {
    app.route('/api/templates/:template')
        .get((req, res) => res.send({ email: templates[req.params.template]}));
}
