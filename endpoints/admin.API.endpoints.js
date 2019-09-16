var validate_host = require('../util/validate_host');
var admin = require('../controllers/API2/admin');

module.exports = (app) => {
    app.route('/api/users/')
        .get(admin.users.get) //validate_host, admin.users.get)
        .post(admin.users.create); //validate_host, admin.users.create);
}
