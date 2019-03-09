var config = require('../config/config');

var token = config.signrequest.token;

var sr = require('signrequest-client');
var docApi = new sr.DocumentsApi();

var createDocument = (data) => {
    var doc = new sr.Document({
        );



module.exports = {
    createDocument: createDocument
}
