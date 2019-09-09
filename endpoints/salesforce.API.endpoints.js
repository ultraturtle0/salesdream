var sf = require('../controllers/API2/salesforce');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/api/sf/picklists')
        .get(validate_token, sf['picklists'].get);

    ['Lead', 'Account']
        .forEach((obj) =>
            app.route('/api/sf/' + obj)
                .get(validate_token, sf[obj].get)
                .post(validate_token, sf[obj].create)
        );
};
