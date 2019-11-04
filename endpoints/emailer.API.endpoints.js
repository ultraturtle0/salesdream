var emailer = require('../controllers/API2/emailer');
var validate_token = require('../config/strategies/jwt');


module.exports = (app) =>
    app.route('/api/emailer')
        .post(emailer.post);
