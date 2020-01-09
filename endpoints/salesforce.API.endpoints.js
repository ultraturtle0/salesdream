var sf = require('../controllers/API2/salesforce');
var validate_token = require('../config/strategies/jwt');
var keys = require('../util/API_key.js');

module.exports = (app) => {
    app.route('/api/sf/picklists')
        .get(keys.verify(['sf.picklists']), sf['picklists'].get);
    app.route('/api/sf/partners')
        .get(keys.verify(['sf.partners']), sf['partners'].get);

    ['Lead', 'Account']
        .forEach((obj) =>
            app.route('/api/sf/' + obj)
                .get(keys.verify([`sf.${obj}.get`]), sf[obj].get)
                .post(keys.verify([`sf.${obj}.create`]), sf[obj].create)
        );
};
