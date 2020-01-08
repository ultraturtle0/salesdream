const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const uuid = require('uuid/v4');
var sf = require('../../apps/salesforce');
var axios = require('axios');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');


module.exports = (api_key) => {
    const instance = axios.create({
        params: { api_key }
    });
    
    return ({
        get: (req, res, next) => 
            instance.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/sf/picklists`, req.query)
                .then((picklists) => res.send({ picklists, link: req.data.link }))
                .catch((err) => handler({
                    custom: 'Error connecting to Salesforce, please try again momentarily.',
                    err,
                    res})
                ),

        post: (req, res, next) => {
            var { internal, id, ...body } = req.body;
            var update = {
                questionnaire: body,
                completed: Date.now(),
                email: body.email
            };

            // if questionnaire was not updated internally:
            //if (internal !== 'true') {
            instance.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/link/update`, req.query)
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

        }
    });
};
