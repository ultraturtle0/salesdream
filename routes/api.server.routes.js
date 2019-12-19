var validate_token = require('../config/strategies/jwt');
var validate_link = require('../util/validate_link');
var calendar = require('../controllers/API/calendar');
var picklists = require('../controllers/API/picklists');
var inject_API = require('../util/inject_API');

module.exports = (app) => {
    app.route('/api/calendar')
        .get(validate_token('GET'), calendar.get);
    app.route('/api/picklists')
        .get(validate_link('link'), inject_API, picklists.get);
}
