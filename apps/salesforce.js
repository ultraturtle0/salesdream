var config = require('../config/config');

var jsforce = require('jsforce');
var conn = new jsforce.Connection({
    loginUrl: 'https://login.salesforce.com'
});

var username = config.salesforce.username;
var password = config.salesforce.password;
var token = config.salesforce.token;

var records = [];

var createObj = (conn, type, obj) =>
    conn.sobject(type).create(obj, (err, res) => {
        if (err || !res.success) return console.error(err, res);
        console.log("Created record id: " + res.id);
    });


var connCallback = (err, userInfo) => {
    if (err) return console.error(err);
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);
    console.log("user id: " + userInfo.id);
    console.log("org id: " + userInfo.organizationId);
    /*conn.query("SELECT Id, Name FROM Account")
        .on("record", record => records.push(record))
        .on("error", err => console.error(err))
        .on("end", () => console.log(records));
    */


    /*conn.sobject("Account").create({
        Name: 'New Account'
    }, (err, ret) => {
*/
};

;

module.exports = {
    login: () => conn.login(username, password + token, connCallback),
    conn:conn,
    createObj: createObj
}
