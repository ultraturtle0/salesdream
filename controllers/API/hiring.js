var sf = require('../../apps/salesforce');
var SignrequestClient = require('signrequest-client');
const uuid = require('uuid/v4');

var axios = require('axios');
const config = require('../../config/config');

var defaultClient = SignrequestClient.ApiClient.instance;
var Token = defaultClient.authentications['Token'];
Token.apiKey = config.signrequest.token;
Token.apiKeyPrefix = 'Token';

var srApi = new SignrequestClient.SignrequestQuickCreateApi();


module.exports = (req, res, next) => {
    console.log('Hiring Process Initiated');
    var body = req.body; 
    
    // GENERATE W9
    var w9 = new SignrequestClient.SignRequestQuickCreate();

    w9.from_email = config.signrequest.email;
    w9.disable_emails = true;
    w9.who = 'o';
    w9.signers = [
        {
            email: body.Email,
            first_name: body.FirstName,
            last_name: body.LastName,
            in_person: true,
            embed_url_user_id: uuid()
        }
    ];
    w9.name = `${body.FirstName} ${body.LastName} W9`;
    w9.template = config.signrequest.templates.w9.url;

    // GENERATE BACKGROUND CHECK
    var bg = new SignrequestClient.SignRequestQuickCreate();

    bg.from_email = config.signrequest.email;
    bg.disable_emails = true;
    bg.who = 'o';
    bg.signers = [
        {
            email: body.Email,
            first_name: body.FirstName,
            last_name: body.LastName,
            in_person: true,
            embed_url_user_id: uuid()
        }
    ];
    bg.name = `${body.FirstName} ${body.LastName} Background Check`;
    bg.template = config.signrequest.templates.bg_check.url;

    // GENERATE CONTRACTOR CONTRACT
    var contract = new SignrequestClient.SignRequestQuickCreate();

    contract.from_email = config.signrequest.email;
    contract.who = 'o';
    contract.signers = [
        {
            email: body.Email,
            first_name: body.FirstName,
            last_name: body.LastName,
            in_person: true,
            order: 1,
            embed_url_user_id: uuid()
        },
        {
            email: config.signrequest.signer.email,
            first_name: config.signrequest.signer.firstName,
            last_name: config.signrequest.signer.lastName,
            in_person: false,
            order: 2,
        }
    ];
    contract.name = `${body.FirstName} ${body.LastName} Contractor Contract`;
    contract.template = config.signrequest.templates.contractor_contract.url;
    // (last document in flow)
    var redirect = (config.domain === 'localhost') ?
        "http://gswfinancialpartners.com" :
        `http://${config.domain}:${config.port}/thankyou`;
    contract.redirect_url = redirect; // replace with thank-you/instruction page

    // BUILD FLOW IN REVERSE ORDER
    // what can you do about callback hell here?

    // start with contractor contract ...
    srApi.signrequestQuickCreateCreate(contract, (err, data, response) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: err });
        } else {
            console.log('Successful contract creation.');
 
            // ADD REDIRECT URL
            w9.redirect_url = data.signers[1].embed_url;

            // ...then W9
            srApi.signrequestQuickCreateCreate(w9, (err, data, response) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ message: err });
                } else {
                    console.log('Successful W-9 creation.');
                    
                    // ADD REDIRECT URL
                    bg.redirect_url = data.signers[1].embed_url;
                    
                    // ...then background check
                    srApi.signrequestQuickCreateCreate(bg, (err, data, response) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send({ message: err });
                        } else {
                            console.log('Successful background check creation.');

                            // FINALLY RESPOND TO SERVER REQUEST

                            res.status(301).redirect(data.signers[1].embed_url);

                        }
                    });
                }
            }); 
        };
    });
};
