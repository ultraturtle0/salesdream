var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const surveyEmail = require('../../config/emails/introduction');
const { ObjectId } = require('mongoose').Types;
const uuid = require('uuid/v4');
const handler = require('../../util/errorHandler');
var moment = require('moment');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');
const gauth = require('../../util/google_token');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    return {
        /*get: (req, res, next) =>
            sf.login()
                .then(() => sf.picklists(PL))
                .then((picklists) => res.send({ picklists }))
                .catch((err) => 
                    handler({
                        custom: 'Error retrieving picklists.',
                        err,
                        res
                    })
                ),
                */

        post: (req, res, next) => {
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

            instance
                .post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/sf/Lead`, sfbody)
                .then((lead) => 
                    instance.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/link/create`, {
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
                .then((link) => {
                    // REFACTOR THIS
                    var template = {
                        questionnaire: true,
                        link: `${config.API.protocol}//${config.domain}:${config.port}/questionnaire/${qLink}`,
                        code: body.Zoom_Meeting_ID,
                        FirstName: body.FirstName,
                        LastName: body.LastName,
                        Email: body.Email
                    };
                    if (body.startEvent) {
                        var meeting = moment(body.startEvent);
                        template = {
                            dateQuestionnaire: moment(body.startEvent).subtract(2, 'days').format("dddd, MMMM Do YYYY"),
                            time: meeting.format('h:mm a'),
                            date: meeting.format("dddd, MMMM Do YYYY"),
                            ...template
                        };
                    };
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
                                    raw: surveyEmail(template)
                                }
                            })
                        )
                        .catch((err) =>
                            handler({
                                custom: 'Error sending questionnaire email',
                                err,
                                res
                            })
                        );
                })
                .then((link) => {
                    console.log(link.data);
                    return res.status(200).send({ link: link.data });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).send({ errors: [err] })
                });
        }
    }
}



