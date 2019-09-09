var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');

var ledger_get = (req, res, next) => {
    var body = {};
    sf.login()
        .then(() =>
            sf.conn.sobject("Account")
                .find({}, {
                    Id: 1,
                    Name: 1
                })
                .sort({ CreatedDate: -1 })
                .execute()
                .then((Accounts) => {
                    body.accounts = Accounts;
                    return res.send(body);
                }, (err) => 
                    res.status(400).send({ messages: ['error retrieving accounts from Salesforce', err] })
                )
        );
}

module.exports = {
    ledger: {
        get: ledger_get,
    }
};
