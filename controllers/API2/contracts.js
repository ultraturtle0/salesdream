var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');

var contractConfig = {
    client: {
        template: config.signrequest.templates.client_contract.url,
        tags_core: [ 'lf', 'client_address_1_1', 'company_name_1', 'client_name_1', 'rd', 'tf', 'hr', 'rf', 'term', 'client_phone', 'client_email_1' ],
        tags_redundant: {
            client_name_1: ['client_name_2', 'client_name_3', 'cl_name_4', 'client_name_5', 'client_name_6', ],
            client_address_1_1: ['client_address_2'],
            client_email_1: ['client_email_2'],
            company_name_1: ['company_name_2'],
        },
    },
    headhunter: {
        template: config.signrequest.templates.headhunter_contract.url,
        tags_core: [ 'lf', 'client_address_1_1', 'company_name_1', 'client_name_1', 'rd', 'af', 'client_phone', 'client_email_1' ],
        tags_redundant: {
            client_name_1: [ 'client_name_2', 'client_name_3', 'cl_name_4', 'client_name_5', 'client_name_6' ],
            client_address_1_1: ['client_address_2'],
            client_email_1: ['client_email_2'],
            company_name_1: ['company_name_2'],         
        },
    }
};

// our headers tell SignRequest we're sending json format and we have token authorization
var headers = {
  'Content-Type': 'application/json',
  'Authorization': `Token ${config.signrequest.token}`
};



var post = (req, res, next) => {
    var { contract, ...inputData } = req.body;
    var body;
    var prefill_tags = {};
    var signer1;

    var template = contractConfig[contract];

    // transfer the first set of tags from SurveyMonkey
    template.tags_core.forEach(tag => prefill_tags[tag] = inputData[tag]);

    // assign 'client_name_1' to some redundant SignRequest tags
    Object.keys(template.tags_redundant).forEach(tag => 
        template.tags_redundant[tag].forEach(field => prefill_tags[field] = prefill_tags[tag]));

    // assign standard info
    prefill_tags['gsw_name_1'] = 'Gabriella Sande Waterman';
    prefill_tags['gsw_title_1'] = 'Owner of GSW Financial Partners';	
  
    signer1 = {
        email: prefill_tags['client_email_1'],
        first_name: prefill_tags['client_name_1'].split(" ")[0],
        last_name: prefill_tags['client_name_1'].split(" ")[1],
        needs_to_sign: true,
        order: 1
    };

    var formatted_tags = [];

	for (var key in prefill_tags) {
	    formatted_tags.push({external_id: key, text: prefill_tags[key]})
	};

	body = {
	    from_email: 'gswfp@gswfinancialpartners.com',
	    from_email_name: 'GSW Financial Partners',
	    subject: 'GSW Financial Partners is awaiting your signature.',
	    message: `Please review our ${contract.charAt(0).toUpperCase() + contract.slice(1)} Contract as previously discussed, fill in your company information, and sign where necessary.\n\nWe look forward to working with you!`,
	    // 'm', 'o', or 'mo', depending on whether Me and/or Others need to sign
	    who: 'o',
        signers: [
            {
                email: 'gswfp@gswfinancialpartners.com',
                first_name: 'Gabriella',
                last_name: 'Sande Waterman',
                needs_to_sign: false,
                order: 0,
                redirect_url: 'http://gswfinancialpartners.com'
            },
            signer1,
            {
                email: "gabriella@gswfinancialpartners.com",
                first_name: 'Gabriella',
                last_name: 'Sande Waterman',
                needs_to_sign: true,
                order: 2,
            }
        ],

	    template: template.template,
	    prefill_tags: formatted_tags
	};

	axios.post('https://signrequest.com/api/v1/signrequest-quick-create/', body, { headers })
	    .then((response) => {
            res.send(response.data);
	    })
	    .catch((err) => {
	        console.log(err);
            res.status(500).send(err);
	    });
};

module.exports = {
    post
};
