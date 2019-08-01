var sf = require('../../apps/salesforce');
var moment = require('moment');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;

var get = (req, res, next) => {
    var body = {
        leads: [],
        picklists: {},
        messages: [],
        errors: []
    };
    sf.login()
        .then(() => 
            sf.conn.sobject("Lead")
                .find({}, {
                    Id: 1,
                    Company: 1,
                    CreatedDate: 1,
                    Description: 1,
                    Title: 1,
                    Email: 1,
                    FirstName: 1,
                    LastName: 1,
                    LeadSource: 1,
                    Lead_Source_Other__c: 1,
                    Phone: 1,
                    Status: 1,
                    Tax_Preparer_Other__c: 1,
                    Tax_Preparer__c: 1,
                    Zoom_Meeting__c: 1,
                    Zoom_Meeting_ID__c: 1,
                    Questionnaire_ID__c: 1

                })
                .sort({ CreatedDate: -1 }) 
            
                // find Leads
                .execute()
                .then((Leads) => {
                    body.messages.push((Leads.length ? '' : 'No new leads, go get some!'));
                    body.leads = Leads;
                    console.log('GOT LEADS');
                    console.log(Leads);
                    return sf.conn.describe("Account");
                })

                // load Account picklists
                .then((account) => {
                    console.log('GOT PICKLISTS');
                    ['Industries', 'Software', 'Business Classification', 'Account Source', 'Tax Preparer'].forEach((list) => 
                        body.picklists[list] = account.fields
                            .filter(field => (field.label === list))
                            .map(picklist => 
                                picklist.picklistValues
                                    .map(value => value.label)
                                    .filter(value => (value !== 'N/A'))
                            )[0]
                    );
                    console.log(body.picklists);
                    return sf.conn.describe("Contact");
                })

                // load Contact picklists
                .then((contact) => {
                    console.log('GOT CONTACT PICKLISTS');
                    ['Contact Source'].forEach((list) =>
                        body.picklists[list] = contact.fields
                            .filter(field => (field.label === list))
                            .map(picklist => 
                                picklist.picklistValues
                                    .map(value => value.label)
                            )[0]
                    ); 
                    console.log(body.picklists);

                    return sf.conn.describe("Lead");
                })

                // load Lead picklists
                .then((Lead) => {
                    console.log('GOT LEADS');
                    var list = 'Reasons for Rejection';
                    body.picklists[list] = Lead.fields
                        .filter(field => (field.label === list))
                        .map(picklist => 
                            picklist.picklistValues
                                .map(value => value.label)
                        )[0];
                    console.log(body.picklists);

                    return res.send(body);
                })

                .then(null, (err) => {
                    console.log('ERROR CAUGHT');
                    console.log(err);
                    body.errors.push('Error connecting to Salesforce database.');
                    response.status(400).send(body);
                })
        );
};

var post = (req, response, next) => {
    console.log('Basic Client Onboarding completed.');

    var body = req.body;
    if (body.Converted === 'true') {
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
             
        // console.log(AccountBody);
        // console.log(ContactBody);

        sf.login()
            // stop all email reminders (Workflow)
            .then(() => {
                console.log('LEAD REMINDERS');
                return sf.conn.sobject("Lead").update({ Id: req.body.Id, Stop_Internal_Reminders__c: true });
                //(err) => response.status(400).send({ errors: ['Error authenticating Salesforce', err] })
            }) 

            // convert Lead
            .then((res) => {
                console.log('LEAD CONVERSION');
                console.log(res);
                if (res.errors.length)
                    return response.status(400).send({ errors: ['Error stopping Lead reminders.', ...res[0].errors] });
                return sf.conn.soap.convertLead([{
                    convertedStatus: 'Closed - Converted',
                    leadId: req.body.Id
                }]);
            })//, (err) => response.status(400).send({ errors: ['Internal error stopping Lead reminders.', err] }))

            // update Account/Contact objects
            .then((res) => {
                console.log('ACCOUNT UPDATE');
                console.log(res);
                if ('errors' in res[0] && res[0].errors.length)
                    return response.status(400).send({ errors: ['Error converting Lead.', ...res[0].errors] });
                return sf.conn.sobject("Account")
                    .find({ Id: res[0].accountId })
                    .update(AccountBody);
            })//, (err) => response.status(400).send({ errors: ['Internal error converting Lead.', err] }))

            // update Contact
            .then(res => {
                console.log('CONTACT UPDATE');
                console.log(res);
                if ('errors' in res[0] && res[0].errors.length)
                    return response.status(400).send({ errors: [`Error updating Account "${AccountBody.Name}`, ...res[0].errors] });
                return sf.conn.sobject("Contact")
                    .find({ Id: res[0].contactId })
                    .update(ContactBody);
            })//, (err) => response.status(400).send({ errors: [`Internal error updating Account "${AccountBody.Name}"`, err] }))

            // return final success response
            .then(res => {
                console.log('RESPONSE RETURN');
                console.log(res);
                if ('errors' in res[0] && res[0].errors.length)
                    return response.status(400).send({ errors: [`Error updating Contact "${ContactBody.Name}`, ...res[0].errors] });

                return response.status(200).send({ errors: [], messages: ['success'] });

            })
            .then(null, (err) => {
                console.log('Final ERROR: ');
                console.log(err);
                return response.status(400).send({ errors: ["Internal error.", err] });
            });
    }

    // IF DISMISSAL
    
    else if (body.Converted === 'false') {
        var LeadBody = {
            //Stop_Internal_Reminders__c: true
            LeadSource: body.AccountSource,
            Status: 'Closed - Not Converted',
            Lead_Source_Other__c: body.AccountSourceOther,
            Company: body.Company,
            Description: body.Description,
            Email: body.Email,
            FirstName: body.FirstName,
            LastName: body.LastName,
            Phone: body.Phone,
            Reasons_for_Rejection__c: body.Reasons,
            Reason_Detail__c: body.ReasonsOther
        };

        sf.login()
            .then(() => {
                /*if (res[0].errors.length)
                    return response.status(400).send({ errors: ['Error authenticating Salesforce', ...res[0].errors] });
                 */
                return sf.conn.sobject("Lead")
                    .find({ Id: body.Id })
                    .update(LeadBody);
            })
            .then((res) => {
                if (res[0].errors.length)
                    return response.status(400).send({ errors: ['Error converting Lead.', ...res[0].errors] });
                return response.status(200).send({ errors: [], messages: ['success'] });
            })
            .then(null, (err) => {
                console.log('Final ERROR: ');
                console.log(err);
                return response.status(400).send({ errors: ["Internal error.", err] });
            });
    }

    else return response.status(400).send({ errors: ['Error converting Lead - no conversion status received.']});

};


module.exports = { get, post };
