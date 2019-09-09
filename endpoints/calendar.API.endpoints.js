var calendar = require('../controllers/API2/calendar');
var validate_token = require('../config/strategies/jwt');


module.exports = (app) =>
    app.route('/api/calendar')
        .get(calendar.get)
        .post(calendar.post);
