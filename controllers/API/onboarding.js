var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;

var get = (req, res, next) => {
    var sfQuery = {};
    var sfOptions = {
        sort: { CreatedDate: -1 }
    };
    sf.login()
        .then(() => 
            sf.conn.sobject("Lead").find({}).execute((err, leads) => {
                var message = err ?
                    'Error connecting to Salesforce database, please try again.'
                    : (leads.length ? '' : 'No new leads, go get some!');
                sf.conn.describe("Account", (err, account) => {

                    var picklists = {};
                    var message = '';
                    if (err) {
                        message = 'Error retrieving picklist values.';
                        return res.status(400).send({message, picklists});
                    }; 
                    ['Industry', 'Software', 'Classification', 'Preparer'].forEach((list) => 
                        picklists[list] = account.fields
                            .filter(field => (field.label === list))
                            .map(picklist => 
                                picklist.picklistValues
                                    .map(value => value.label)
                            )[0]
                    );
                    
                    sf.conn.describe("Contact", (err, contact) => {
                        if (err) {
                            message = 'Error retrieving picklist values.';
                            return res.status(400).send({message, picklists});
                        };
                        ['Referral'].forEach((list) =>
                            picklists[list] = contact.fields
                                .filter(field => (field.label === list))
                                .map(picklist => 
                                    picklist.picklistValues
                                        .map(value => value.label)
                                )[0]
                        ); 
                        return res.send({ message, leads, picklists: picklists });
                    });
                });
            })
        );
        /*(err) => {
            console.log(err)
                        });
        });*/
};

var post = (req, response, next) => {
    console.log('Basic Client Onboarding completed.');
    var body = req.body;
    var AccountBody = {
        //FirstName: body.FirstName, 
        //LastName: body.LastName,
        //Phone: body.Phone,
        //Email: body.Email,
        BillingStreet: body.BillingStreet,
        BillingCity: body.BillingCity,
        BillingState: body.BillingState,
        BillingPostalCode: body.BillingPostalCode,
        ShippingStreet: body.ShippingStreet,
        ShippingCity: body.ShippingCity,
        ShippingState: body.ShippingState,
        ShippingPostalCode: body.ShippingPostalCode,
        //Classification__c: body.Classification,
        //Current__c: body.Current,
        //Industry: body.Industry,
        //Software__c: body.Software,
        //Software_Other__c: body.SoftwareOther,
        //Bookkeeping_Frequency: body.Frequency,
        //Past_Bookkeeper: body.pastBookkeeper,
        //Hours_Per_Month: body.Hours,
        //Preparer__c: body.Preparer,
        //Preparer_Other__c: body.PreparerOther,
        //Books_Rating: body.Rating,
        //Description: body.Description
    };
    var ContactBody = {
        FirstName: body.FirstName, 
        LastName: body.LastName,
        Title: body.Title,
        Phone: body.Phone,
        Email: body.Email,
        Referral__c: body.Referral,
        Referral_Other__c: body.ReferralOther
    };
       
    console.log(body);
    sf.login()
        .then(() => sf.conn.soap.convertLead([{
            convertedStatus: 'Closed - Converted',
            leadId: req.body.Id
        }], (err, res) => {
            if (err) return response.status(400).send(err);
            console.log(res);
            //if (!res.success) return response.status(400).send({message: "Internal Salesforce error"});
            AccountBody.Id = res[0].accountId;
            // update Account
            sf.conn.sobject("Account").update(AccountBody)
                .then((res) => response.status(200).json({data: 'ok'}))
                .catch((err) => response.status(400).send(err));
        }))
        .catch((err) => {
            console.log(err);
            response.status(400).send(err);
        });
};

module.exports = { get, post };
