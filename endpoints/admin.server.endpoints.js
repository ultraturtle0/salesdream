var secure_admin = require('../config/strategies/secure_admin');
var admin = require('../controllers/admin.server.controller.js');

module.exports = (app) => {
    app.route('/admin')
        .get(secure_admin, (req, res) => res.render('admin'));

    app.route('/api/users/')
        .post(secure_admin, admin.post);

}
