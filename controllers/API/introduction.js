var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;


var post = (req, res, next) => {
    console.log('Basic Client Introduction completed.');
    var body = req.body;
    // PREPARER
    var sfbody = {
        FirstName: body.FirstName,
        LastName: body.LastName,
        Company: body.Company,
        Email: body.Email,
        Phone: body.Phone,
        Referral__c: body.Referral,
        ReferralOther__c: body.ReferralOther,
        Preparer__c: body.Preparer,
        PreparerOther__c: body.PreparerOther,
        ReferralLength__c: body.ReferralLength,
        Description: body.Description
    };

    sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        .then(() => res.status(200).json({data: 'ok'}))
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });

};

module.exports = {
    post: post
};
