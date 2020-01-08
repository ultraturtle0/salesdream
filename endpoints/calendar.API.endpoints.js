var calendar = require('../controllers/API2/calendar');
var validate_token = require('../config/strategies/jwt');
var keys = require('../util/API_key');

module.exports = (app) =>
    app.route('/api/calendar')
        .get(keys.verify(['calendar.get']), calendar.get)
        .post(keys.verify(['calendar.create']), calendar.post);
