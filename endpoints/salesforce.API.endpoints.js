var sf = require('../controllers/API2/salesforce');
var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/api/sf/picklists')
        .get(sf['picklists'].get);

    ['Lead', 'Account']
        .forEach((obj) =>
            app.route('/api/sf/' + obj)
                .get(sf[obj].get)
                .post(sf[obj].create)
        );
};
