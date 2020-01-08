var link = require('../controllers/API2/link');
var validate_token = require('../config/strategies/jwt');
var keys = require('../util/API_key.js');

module.exports = (app) => {
    // API routes 
    app.route('/api/link/create')
        .post(keys.verify(['links.create']), link.create);
    app.route('/api/link')
        .get(keys.verify(['links.get']), link.get);
    app.route('/api/link/:_id')
        .get(keys.verify(['links.get']), link.get)
        .put(keys.verify(['links.update']), link.update);
};
