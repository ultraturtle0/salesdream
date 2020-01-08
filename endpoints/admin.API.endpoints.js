var validate_host = require('../util/validate_host');
var admin = require('../controllers/API2/admin');
var keys = require('../util/API_key.js');

module.exports = (app) => {
    app.route('/api/users/')
        .get(keys.verify(['users.get']), admin.users.get) //validate_host, admin.users.get)
        .post(keys.verify(['users.create']), admin.users.create); //validate_host, admin.users.create);
    app.route('/api/keygen')
        .post(keys.request());
    app.route('/api/verify')
        .post(keys.verify(['admin']), (req, res) => res.send({message: 'success'}));
}
