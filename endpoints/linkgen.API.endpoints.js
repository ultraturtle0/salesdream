var link = require('../controllers/API2/link');
var validate_token = require('../config/strategies/jwt');
var api_key = require('../config/strategies/api_key');

module.exports = (app) => {
    // API routes 
    app.route('/api/link/create')
        .post(api_key, link.create);
    app.route('/api/link')
        .get(api_key, link.get);
    app.route('/api/link/:_id')
        .get(api_key, link.get)
        .put(api_key, link.update);
};
