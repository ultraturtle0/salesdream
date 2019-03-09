var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;


module.exports = (req, res, next) => {
    console.log('Basic Client Onboarding completed.');
    var body = req.body;
    var sfbody = {
        FirstName: body.FirstName, 
        LastName: body.LastName,
        Phone: body.Phone,
        Email: body.Email,
        Company: body.Company,
        Description: body.Description
    };
    sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        .then(() => res.status(200).json({data: 'ok'}))
        .catch((err) => {
            console.log(err);
            res.status(400);
        });

};
