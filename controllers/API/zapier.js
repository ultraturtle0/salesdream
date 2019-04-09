const config = require('../../config/config');

var sr_net = 'main_net'; // change this to a mainnet when converting to production
var sr_token = 'sup'; // our access token


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



/* When we receive a Zapier post request, we need to do the following:
 *
 * 1. tell Zapier everything's OK.
 * 2. determine which type of document needs to be created
 * 3. build headers, format information, and send to SignRequest
 * 4. wait for response and act appropriately
 * (5. send an alert to redo the submission if we get an error back!)
 */

var post = (req, res, next) => {

    console.log(req.body);

    var inputData = req.inputData;

	var prefill_tags = {} // this will collect our prefill info

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

    // assign 'client_address_1_1' to some redundant SignRequest tags
    prefill_tags['client_address_2'] = inputData['client_address_1_1'];

    // assign 'client_email_1' to some redundant SignRequest tags
    prefill_tags['client_email_2'] = inputData['client_email_1'];

    // assign 'company_name_1' to some redundant SignRequest tags
    prefill_tags['company_name_2'] = inputData['company_name_1'];

    // add some standard information we need for SignRequest
    prefill_tags['gsw_name_1'] = 'Gabriella Sande Waterman';
    prefill_tags['gsw_title_1'] = 'Owner of GSW Financial Partners';

    // format the tags and collect them in a new variable
    var formatted_tags = [];

    for (var key in prefill_tags) {
        formatted_tags.push({external_id: key, text: prefill_tags[key]})
    };
    
    // prepare the rest of the POST request body
    var body = {

        // edit this email information as desired
        from_email: 'gswfp@gswfinancialpartners.com',
        from_email_name: 'GSW Financial Partners',
        redirect_url: 'http://gswfinancialpartners.com',
        subject: 'GSW Financial Partners is awaiting your signature.',
        message: 'Please review our headhunter contract as previously discussed, fill in your company information, and sign where necessary.\n\nWe look forward to working with you!',

         // 'm', 'o', or 'mo', depending on whether Me and/or Others need to sign
        who: 'o',

        // here's what SignRequest uses to fill in the blanks
        prefill_tags: formatted_tags
    };

    axios.post('https://signrequest.com/api/v1/signrequest-quick-create/', body)
        .then((response) => {
            console.log('SUCCESS OMG WOW');
            console.log(response);
        })
        .catch((err) => {
            console.log('oopsie daisy');
            console.log(err);
        })
        .finally((response) => {
            res.status(200).send({ message: 'OK' });
        });

};



module.exports = {
    post: post
};
