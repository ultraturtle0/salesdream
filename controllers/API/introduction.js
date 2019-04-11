var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;

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
                console.log(picklists);
                
                return res.send({ message, picklists });
            })
        );
};

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
        LeadSource: body.Referral,
        Lead_Source_Other__c: body.ReferralOther,
        Tax_Preparer__c: body.Preparer,
        Tax_Preparer_Other__c: body.PreparerOther,
        //ReferralLength__c: body.ReferralLength,
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
    get,
    post
};
