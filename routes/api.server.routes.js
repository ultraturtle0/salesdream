var validate_token = require('../config/strategies/jwt');
var calendar = require('../controllers/API/calendar.js');
var picklists = require('../controllers/API/picklists.js');

module.exports = (app) => {
    app.route('/api/calendar')
        .get(validate_token('GET'), calendar.get);
    app.route('/api/picklists')
        .get(validate_token('GET'), picklists.get);
}
