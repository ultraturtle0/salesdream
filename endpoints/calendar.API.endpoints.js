var calendar = require('../controllers/API2/calendar');
var validate_token = require('../config/strategies/jwt');


module.exports = (app) =>
    app.route('/api/calendar')
        .get(validate_token, calendar.get)
        .post(validate_token, calendar.post);
