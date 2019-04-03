var validate_token = require('../config/strategies/jwt');

//var zapier = require('../controllers/zapier.server.controller.js');

module.exports = (app) => {
    app.route('/api/zapier')
        //.post(validate_token, zapier.post);
        .post((req, res) => {
            console.log(req.body);
            res.status(200).send({});
        });

}
