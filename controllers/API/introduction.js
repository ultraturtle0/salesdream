var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const surveyEmail = require('../../config/emails/questionnaire');
const uuid = require('uuid/v4');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');
const gauth = require('../../util/google_token');

var get = (req, res, next) => {
    sf.login()
        .then(() => 
            sf.conn.describe("Lead", (err, lead) => {

                var picklists = {};
                var message = '';
                if (err) {
                    message = 'Error retrieving picklist values.';
                    return res.status(400).send({message, picklists});
                }; 
                ['Lead Source', 'Tax Preparer'].forEach((list) => 
                    picklists[list] = lead.fields
                        .filter(field => (field.label === list))
                        .map(picklist => 
                            picklist.picklistValues
                                .map(value => value.label)
                                .filter(value => (value !== 'N/A'))
                        )[0]
                );
                
                return res.send({ message, picklists });
            })
        );
};

var post = (req, res, next) => {
    console.log('Basic Client Introduction completed.');
    var body = req.body;
    console.log(body);

    if ('ReferralLength' in body)
        body.Description = body.Description.concat('\n', `${body.FirstName} has been with their current tax preparer for ${body.ReferralLength}.`);
    // PREPARER
    var sfbody = {
        FirstName: body.FirstName,
        LastName: body.LastName,
        Company: body.Company,
        Email: body.Email,
        Phone: body.Phone,
        LeadSource: body.Referral,
        Lead_Source_Other__c: body.ReferralOther,
        Tax_Preparer__c: body.Preparer,
        Tax_Preparer_Other__c: body.PreparerOther,
        Description: body.Description
    };


    /*sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        ///////////////////////////////////////////////////////
        // generate questionnaire link and send
        .then((lead) => {
        */
        var Link;
            if (body.questionnaire === 'true') {
                console.log("we're in");
                Link = new LinkSchema({
                    salesforce: uuid(), //lead.id,
                    email: body.Email
                });
            } else {
                res.status(200).send({data: 'ok'});
            }
    
        Link.save()
        .then((link) => 
            gauth('emailer', 'gswfp@gswfinancialpartners.com')
                .then((auth) => 
                    google.gmail({
                        version: 'v1',
                        auth
                    })
                    .users.messages.send({
                        userId: 'me',
                        requestBody: {
                            raw: surveyEmail({
                                FirstName: body.FirstName,
                                LastName: body.LastName,
                                Email: body.Email,
                                // MAKE SURE THIS IS HTTPS LATER
                                link: `http://${req.get('host')}/survey/${link._id}/`
                            })
                        }
                    })
                )
                .then((email) => res.status(200).send({data: 'ok'}))
                .catch((err) => console.log('error here', err))
        )
        .catch((err) => res.status(400).send({ errors: [err] }));
};


module.exports = {
    get,
    post
};
