var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const surveyEmail = require('../../config/emails/questionnaire');
const { ObjectId } = require('mongoose').Types;

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
    var standard = ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description']
        .reduce((acc, key) => {
            acc[key] = body[key];
            return acc;
        }, {});
    var Link_id = new ObjectId;
    var sfbody = {
        LeadSource: body.Referral,
        Lead_Source_Other__c: body.ReferralOther,
        Tax_Preparer__c: body.Preparer,
        Tax_Preparer_Other__c: body.PreparerOther,
        Zoom_Meeting__c: body.startEvent,
        Zoom_Meeting_ID__c: body.Zoom_Meeting_ID,
        ...standard
    };
    console.log(sfbody);
    body.questionnaire ? 
        sfbody.Questionnaire_ID__c = Link_id
        : false;


    sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        ///////////////////////////////////////////////////////
        // generate questionnaire link and send
        .then((lead) => 
            new LinkSchema({
                _id: Link_id,
                salesforce: lead.id,
                email: body.Email
            }).save()
        )
        .then((link) => {
            // continue to emailer if sending questionnaire, otherwise respond
            if (!body.questionnaire)
                res.status(200).send({ messages: (req.messages || []).concat('Lead saved, questionnaire not sent.') })
            return new gauth('emailer', 'gswfp@gswfinancialpartners.com')
                .auth()
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
                );
        })
        .then((email) => res.status(200).send({ messages: (req.messages || []).concat('Lead saved, questionnaire email sent') }))
        .catch((err) => {
            console.log(err);
            res.status(400).send({ errors: [err] })
        });
};


module.exports = {
    get,
    post
};
