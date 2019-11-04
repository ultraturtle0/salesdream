var link = require('../controllers/API2/link');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    // API routes 
    app.route('/api/link/create')
        .post(link.create);
    app.route('/api/link/:id')
        .get(link.get)
        .put(link.update);
    app.route('/api/link/')
        .post(link.update);
    }
