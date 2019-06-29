var linkgen = require('../controllers/linkgen.server.controller.js');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {

    // pages
    app.route('/linkgen')
        .post(linkgen.gen);

    // API routes 
    app.route('/api/linkgen')
        .get(validate_token, linkgen.get)
        .post(validate_token, linkgen.post);
}
