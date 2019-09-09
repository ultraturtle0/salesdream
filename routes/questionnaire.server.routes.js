var Link = require('mongoose').model('Link');
var validate_token = require('../config/strategies/jwt');

var questionnaire = require('../controllers/questionnaire.server.controller.js');

var validate_Link = (req, res, next) =>
    Link.findOne({ link: req.params.link })
        .then((doc) => {
            if (doc) {
                req.data = req.data ? { ...req.data, link: doc } : { link: doc };
                next();
            } else {
                return res.status(404).send();
            };
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send();
        });

module.exports = (app) => {
    // generate client questionnaire link
    // IS THIS STILL NEEDED?
    /*app.route('/linkgen')
        .post(validate_token, questionnaire.gen);
        */

    app.route('/questionnaire/:link')
        .get(validate_Link, (req, res) => res.render('questionnaire', { id: req.data.link.link }));

}
