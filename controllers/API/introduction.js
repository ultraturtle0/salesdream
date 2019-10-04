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


var get = (req, res, next) => {
    sf.login()
        .then(() => sf.picklists(PL))
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
        Toolkit_ID__c: Link_id,
        ...standard
    };
    body.startEvent ? 
        sfbody.Zoom_Meeting__c = body.startEvent
        : false;

    axios
        .post(`http://${config.API.domain}:${config.API.port}/api/sf/Lead`, sfbody)
        .then((lead) => 
            axios.post(`http://${config.API.domain}:${config.API.port}/api/link/create`, {
                _id: Link_id,
                firstName: body.FirstName,
                lastName: body.LastName,
                companyName: body.Company,
                salesforce: lead.id,
                email: body.Email,
                link: qLink,
                questionnaire: body
            })
        )
    /*
     *  .then((link) => {
     *      send email here!
     *  })
     */
        .then((link) => {
            console.log(link.data);
            return res.status(200).send({ link: link.data });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ errors: [err] })
        });
};


module.exports = {
    get,
    post
};
