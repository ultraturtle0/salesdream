var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    app.route('/thankyou')
        .get(validate_token, (req, res) => res.render('thankyou'));

    app.route('/zapier')
        .post((req, res) => {
            console.log(req);
            res.status(200).send({ data: 'ok' });
        });
}
