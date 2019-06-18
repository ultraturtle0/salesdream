var linkgen = require('../controllers/linkgen.server.controller.js');

module.exports = (app) => {
    app.route('/linkgen')
        .post(linkgen.gen);

    /*app.route('/api/linkgen')
        .get(validate_token, .get)
        .post(validate_token, .post);
        */

}
