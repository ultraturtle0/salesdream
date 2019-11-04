const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const uuid = require('uuid/v4');
var sf = require('../../apps/salesforce');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');

var get = (req, res, next) => {
    axios.get(`https://${config.API.domain}:${config.API.port}/api/sf/picklists`)
        .then((picklists) => res.send({ picklists, link: req.data.link }))
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: ['Error connecting to Salesforce, please try again momentarily.'] });
        });
};

var post = (req, res, next) => {
    console.log(req.body);
    var { internal, id, ...body } = req.body;
    var update = {
        questionnaire: body,
        completed: Date.now(),
        email: body.email
    };

    // if questionnaire was not updated internally:
    //if (internal !== 'true') {
    axios.post(`https://${config.API.domain}:${config.API.port}/api/link/update`)
        .then((link) => {
            res.cookie('complete', link.id, {
                expires: new Date(new Date().getTime() + (1000*60*60*24*365*10))
            });
            res.render('thankyou');
        })
        .catch((err) => {
            res.send({ errors: ['Error saving questionnaire answers.', err] });
        });
    /*} else {
        LinkSchema.updateOne({ _id: id }, update)
            .then((link) => res.send({ messages: ['Questionnaire updated', link] }))
            .catch((err) => res.send({ errors: ['Error saving questionnaire answers.', err] }));
    };
    */

};


module.exports = {
    get,
    post
};
