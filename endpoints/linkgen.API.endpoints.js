var link = require('../controllers/API2/link');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    // API routes 
    app.route('/api/link/create')
        .post(link.create);
    app.route('/api/link')
        .get(link.get);
    app.route('/api/link/:_id')
        .get(link.get)
        .put(link.update);
};
