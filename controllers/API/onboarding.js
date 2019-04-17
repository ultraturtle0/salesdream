var sf = require('../../apps/salesforce');
var moment = require('moment');
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
                    ['Industries', 'Software', 'Business Classification', 'Account Source', 'Tax Preparer'].forEach((list) => 
                        picklists[list] = account.fields
                            .filter(field => (field.label === list))
                            .map(picklist => 
                                picklist.picklistValues
                                    .map(value => value.label)
                                    .filter(value => (value !== 'N/A'))
                            )[0]
                    );
                    
                    sf.conn.describe("Contact", (err, contact) => {
                        if (err) {
                            message = 'Error retrieving picklist values.';
                            return res.status(400).send({message, picklists});
                        };
                        ['Contact Source'].forEach((list) =>
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
        Name: body.Company,
        Phone: body.Phone,
        BillingStreet: body.BillingStreet,
        BillingCity: body.BillingCity,
        BillingState: body.BillingState,
        BillingPostalCode: body.BillingPostalCode,
        ShippingStreet: body.ShippingStreet,
        ShippingCity: body.ShippingCity,
        ShippingState: body.ShippingState,
        ShippingPostalCode: body.ShippingPostalCode,
        Business_Classification__c: body.BusinessClassification,
        Industries__c: body.Industries,
        Software__c: body.Software,
        Bookkeeping_Frequency__c: body.Frequency,
        Bookkeeping_Completion__c: moment(body.Current, 'MM/DD/YYYY').format('YYYY-MM-DD'),
        Service_Hours_per_Month__c: body.Hours,
        Tax_Preparer__c: body.TaxPreparer,
        AccountSource: body.AccountSource,
        Books_Rating__c: body.Rating,
        Description: body.Description
    };

    // optionals
    ['Software_Other__c', 'Account_Source_Other__c', 'Tax_Preparer_Other__c', 'Past_Bookkeeper__c'].forEach(optional => {
        var lookup = optional.replace(/__c/, '').replace(/_+/g, '');
        console.log(lookup);
        if (body[lookup])
            AccountBody[optional] = body[lookup];
    });
    
    var ContactBody = {
        FirstName: body.FirstName, 
        LastName: body.LastName,
        Title: body.Title,
        Phone: body.Phone,
        Email: body.Email,
        // WHY DOESN'T THIS WANNA WORK? NO COLUMN LeadSource??
        LeadSource: body.AccountSource
    };

    // optionals
    if (body.AccountSourceOther)
        ContactBody['Lead_Source_Other__c'] = body.AccountSourceOther;
         
    console.log(AccountBody);
    console.log(ContactBody);
    sf.login()
        // stop all email reminders (Workflow)
        .then(() => sf.conn.sobject("Lead").update({ Id: req.body.Id, Stop_Internal_Reminders__c: true })) 
        .then(() => sf.conn.soap.convertLead([{
            convertedStatus: 'Closed - Converted',
            leadId: req.body.Id
        }], (err, res) => {
            if (err) return response.status(400).send(err);
            console.log(res[0]);
            //if (!res.success) return response.status(400).send({message: "Internal Salesforce error"});
            // update Account
            sf.conn.sobject("Account")
                .find({ Id: res[0].accountId })
                .update(AccountBody, function(err, rets) {
                    if (err) { 
                        console.error(err); 
                        return response.status(400).send({ errors: [err] });
                    };
                    if (rets[0].errors.length > 0) {
                        console.log(`Error updating Account "${AccountBody.Name}":`);
                        var sf_err = rets[0].errors;
                        console.log(sf_err);
                        return response.status(400).send({ errors: sf_err });
                    }
                    
                    // update Contact
                    sf.conn.sobject("Contact")
                        .find({ Id: res[0].contactId })
                        .update(ContactBody, function(err, rets) {
                            if (err) { 
                                console.error(err); 
                                return response.status(400).send({ errors: [err] , message: ''});
                            };
                            if (rets[0].errors.length > 0) {
                                console.log(`Error updating Account "${AccountBody.Name}":`);
                                var sf_err = rets[0].errors;
                                console.log(sf_err);
                                return response.status(400).send({ errors: sf_err, message: '' });
                            }

                            response.status(200).send({ errors: [], message: 'success' });
                        })
                })
        }))

};

module.exports = { get, post };
