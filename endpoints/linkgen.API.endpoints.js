var linkgen = require('../controllers/API2/link');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    // API routes 
    app.route('/api/link/create')
        .post(validate_token, linkgen.create);
}
