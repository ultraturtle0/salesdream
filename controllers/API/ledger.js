var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;

var post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var body = req.body;



};

module.exports = {
    get,
    post
};
