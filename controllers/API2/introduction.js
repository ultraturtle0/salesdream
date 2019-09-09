var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const surveyEmail = require('../../config/emails/introduction');
const { ObjectId } = require('mongoose').Types;
const uuid = require('uuid/v4');
var moment = require('moment');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');
const gauth = require('../../util/google_token');

const PL = {
    Lead: ['Lead Source', 'Tax Preparer'],
    Account: ['Industry', 'Business Classification', 'Software']
};

var get = (req, res, next) => {
    sf.login()
        .then(() => sf.picklists(PL))
            /*sf.conn.describe("Lead", (err, lead) => {

                var picklists = {};
                var message = '';
                if (err) {
                    message = 'Error retrieving picklist values.';
                    return res.status(400).send({message, picklists});
                }; 
                ['Lead Source', 'Tax Preparer', 'Industry', 'Business Classification'].forEach((list) => 
                    picklists[list] = lead.fields
                        .filter(field => (field.label === list))
                        .map(picklist => 
                            picklist.picklistValues
                                .map(value => value.label)
                                .filter(value => (value !== 'N/A'))
                        )[0]
                );
                */
                
        .then((picklists) => res.send({ picklists }))
        .catch((err) => {
            console.log(err);
            res.status(500).send({ errors: ['Error retrieving picklist values.', err] });
        });
};

var post = (req, res, next) => {
    console.log('Basic Client Introduction completed.');
    var body = req.body;

    if ('ReferralLength' in body)
        body.Description = body.Description.concat('\n', `<br>${body.FirstName} has been with their current tax preparer for ${body.ReferralLength}.`);
    var standard = ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description']
        .reduce((acc, key) => {
            acc[key] = body[key];
            return acc;
        }, {});
    var Link_id = new ObjectId;
    var qLink = uuid();

    var sfbody = {
        LeadSource: body.Referral,
        Lead_Source_Other__c: body.ReferralOther,
        Tax_Preparer__c: body.Preparer,
        Tax_Preparer_Other__c: body.PreparerOther,
        ...standard
    };
    body.questionnaire ? 
        sfbody.Questionnaire_ID__c = qLink
        : false;
    body.startEvent ? 
        sfbody.Zoom_Meeting__c = body.startEvent
        : false;

    sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        ///////////////////////////////////////////////////////
        // generate questionnaire link and send
        .then((lead) => 
            new LinkSchema({
                _id: Link_id,
                salesforce: lead.id,
                email: body.Email,
                link: qLink,
                questionnaire: body
            }).save()
        )
        .then((link) => res.status(200).send({ messages: (req.messages || []).concat('Lead saved'), link }))
        .catch((err) => {
            console.log(err);
            res.status(400).send({ errors: [err] })
        });
};


module.exports = {
    get,
    post
};
