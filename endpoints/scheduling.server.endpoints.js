var validate_token = require('../config/strategies/jwt');

var scheduling = require('../controllers/scheduling.server.controller.js');

module.exports = (app) => {
    app.route('/api/scheduling')
        //.post(validate_token, scheduling.post);

        .post(scheduling.post);
}
