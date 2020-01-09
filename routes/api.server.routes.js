var validate_token = require('../config/strategies/jwt');
var validate_link = require('../util/validate_link');
var calendar = require('../controllers/API/calendar');
var picklists = require('../controllers/API/picklists');
var partners = require('../controllers/API/partners');

module.exports = (app) => {
    const api_key = app.get('api_key');

    app.route('/api/calendar')
        .get(validate_token('GET'), calendar(api_key).get);
    app.route('/api/picklists')
        .get(validate_link('link'), picklists(api_key).get);
    app.route('/api/partners')
        .get(validate_link('link'), partners(api_key).get);
}
