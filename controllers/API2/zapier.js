const config = require('../../config/config');

var sr_net = 'main_net'; // change this to a mainnet when converting to production
var sr_token = config.signrequest.token; // our access token


var templates = {
    'headhunter': config.signrequest.templates.headhunter_contract.url
};


// our headers tell SignRequest we're sending json format and we have token authorization
var headers = {
  'Content-Type': 'application/json',
  'Authorization': `Token ${sr_token}`
};


var axios = require('axios')
    .create({
        post: {
            headers: headers
        }
    });

var post = (req, res, next) => {

    console.log(req.body);

    var inputData = req.body;
    var body;
    var prefill_tags = {};
    var signer1;

    var template = templates[req.body.contract];

	//HEADHUNTER CONTRACT SENDER
	if (req.body.contract === 'headhunter') {
	
	    // transfer the first set of tags from SurveyMonkey
	    var tags1 = [
	      'lf',
	      'client_address_1_1',
	      'company_name_1',
	      'client_name_1',
	      'rd',
	      'af',
	      'client_phone',
	      'client_email_1'
	    ];
	    tags1.forEach(tag => prefill_tags[tag] = inputData[tag]);

	    // assign 'client_name_1' to some redundant SignRequest tags
	    var tags2 = [
	      'client_name_2',
	      'client_name_3',
	      'cl_name_4',
	      'client_name_5',
	      'client_name_6',
	    ]
	    tags2.forEach(tag => prefill_tags[tag] = inputData['client_name_1']);
	
	    // reassign redundant SignRequest tags
	    prefill_tags['client_address_2'] = inputData['client_address_1_1'];
	    prefill_tags['client_email_2'] = inputData['client_email_1'];
	    prefill_tags['company_name_2'] = inputData['company_name_1'];

	    prefill_tags['gsw_name_1'] = 'Gabriella Sande Waterman';
	    prefill_tags['gsw_title_1'] = 'Owner of GSW Financial Partners';	
	  
	    signer1 = {
            email: prefill_tags['client_email_1'],
            first_name: prefill_tags['client_name_1'].split(" ")[0],
            last_name: prefill_tags['client_name_1'].split(" ")[1],
            needs_to_sign: true,
            order: 1
	    };
	}

	//CLIENT CONTRACT SENDER
	else if (req.body.contract === 'client') {
	
	    // transfer the first set of tags from SurveyMonkey
	    var tags1 = [
	      'lf',
	      'client_address_1_1',
	      'company_name_1',
	      'term',
	      'client_name_1',
	      'hr',
	      'tf',
	      'rd',
	      'rf',
	      'client_phone',
	      'client_email_1'
	    ];
	    tags1.forEach(tag => prefill_tags[tag] = inputData[tag]);

	    // assign 'client_name_1' to some redundant SignRequest tags
	    var tags2 = [
	      'client_name_2',
	      'client_name_3',
	      'cl_name_4',
	      'client_name_5',
	      'client_name_6'
	    ]
	    tags2.forEach(tag => prefill_tags[tag] = inputData['client_name_1']);
	
	    // reassign redundant SignRequest tags
	    prefill_tags['client_address_2'] = inputData['client_address_1_1'];
	    prefill_tags['client_email_2'] = inputData['client_email_1'];
	    prefill_tags['company_name_2'] = inputData['company_name_1'];

	    prefill_tags['gsw_name_1'] = 'Gabriella Sande Waterman';
	    prefill_tags['gsw_title_1'] = 'Owner of GSW Financial Partners';

	    signer1 = {
            email: prefill_tags['client_email_1'],
            first_name: prefill_tags['client_name_1'].split(" ")[0],
            last_name: prefill_tags['client_name_1'].split(" ")[1],
            needs_to_sign: true,
            order: 1
	    }
	};

    var formatted_tags = [];

	for (var key in prefill_tags) {
	    formatted_tags.push({external_id: key, text: prefill_tags[key]})
	};

	body = {

	    from_email: 'gswfp@gswfinancialpartners.com',
	    from_email_name: 'GSW Financial Partners',
	    subject: 'GSW Financial Partners is awaiting your signature.',
	    message: 'Please review our Client Contract as previously discussed, fill in your company information, and sign where necessary.\n\nWe look forward to working with you!',

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

	    template: template,

	    prefill_tags: formatted_tags
	};

	axios.post('https://signrequest.com/api/v1/signrequest-quick-create/', 
        {
            headers: headers,
            data: body,
        })
	    .then((response) => {
	       console.log('SUCCESS OMG WOW');
	       console.log(response);
	    })
	    .catch((err) => {
	       console.log('oopsie daisy');
	       console.log(err);
	    });

	return res.status(200).send("Success!!");

}

module.exports = {
    post: post
};
