var validate_token = require('../config/strategies/jwt');

var scheduling = require('../controllers/scheduling.server.controller.js');

module.exports = (app) => {
    app.route('/api/scheduling')
        .get(validate_token, scheduling.get)
        .post(validate_token, scheduling.post);
}
