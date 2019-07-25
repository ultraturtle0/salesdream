const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const uuid = require('uuid/v4');
var sf = require('../../apps/salesforce');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');

PL = {
    Lead: ['Industry'],
    Account: ['Software', 'Business Classification']
};

var get = (req, res, next) => {
    console.log(req.data.link);
    var picklists;
    sf.login()
        .then(() => sf.picklists(PL))
        .then((picklists) =>
            sf.conn.sobject("Lead").retrieve(req.data.link.salesforce)
                .then((lead) => {
                    var fields = {
                        firstName: lead.Name.split(' ')[0],
                        lastName: lead.Name.split(' ')[1],
                        companyName: lead.Company,
                        email: lead.Email,
                        phone: lead.Phone,
                    };
                    return res.render('questionnaire', { picklists, fields });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(403).send({ errors: ['Error retrieving client from Salesforce'] });
                })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: ['Error connecting to Salesforce, please try again momentarily.'] });
        });
};

    

var post = (req, res, next) => {
    var { _id, ...body } = req.body;
    Link.findByIdAndUpdate(_id, 
        {
            $set: {
                questionnaire: body,
                completed: Date.now(),
                email: body.email
            }
        }
    )
    .then((link) => {
        res.cookie('complete', link.id, {
            expires: new Date(new Date().getTime() + (1000*60*60*24*365*10))
        });
        res.render('thankyou');
    })
    .catch((err) => {
        res.send({ errors: ['Error saving questionnaire answers.', err] });
    });
};


module.exports = {
    get,
    post
};
