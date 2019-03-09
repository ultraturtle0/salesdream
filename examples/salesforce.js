var config = require('../config/config');

var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl: 'https://login.salesforce.com'
});

var username = config.salesforce.username;
var password = config.salesforce.password;
var token = config.salesforce.token;


conn.login(username, password + token, (err, userInfo) =>
