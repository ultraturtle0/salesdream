const Link = require('mongoose').model('Link');
const surveys = require('../controllers/surveys.server.controller');

const routes = ['QBO', 'newHire', 'newClient'];

var validate_token = require('../config/strategies/jwt');

module.exports = (app) => {
    /*routes.forEach(route =>
        app.route('/' + route)
            .get(surveys.webhook_approval)
            .post(surveys[route])
    );
    */

    app.route('/QBOtest')
        .get(validate_token, (req, res) => res.render('test'));

    app.route('/surveys/:id')
        .get((req, res) => 
            Link.findById(req.params.id, '-link -salesforce')
                .then((link) => 
                    link ?  
                        res.render('questionnaire', { link }) :
                        res.status(404).send({ error: 'survey not found' })
                )
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({ error: err });
                })
        );
}
