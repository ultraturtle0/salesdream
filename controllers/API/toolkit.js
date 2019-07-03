var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
const { mv, ls, mkdir, mksheet } = require('../../util/filegen');
const CLIENT_FILES = config.g_drive.folders.client_files;
const moment = require('moment');

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

var ledger_post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var { cardInfo, bankInfo, otherInfo, name } = req.body;

    var ledger_sheet = [];
    if (cardInfo)
        cardInfo.forEach((cat) => 
            ledger_sheet.push(['CardName', 'CardType', 'CardBank', 'CardStatementCycle', 'CardLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);

    if (bankInfo)
        bankInfo.forEach((cat) => 
            ledger_sheet.push(['BankName', 'BankType', 'Bank', 'BankStatementCycle', 'BankLastReconciled'].map((field) => cat[field])));
            ledger_sheet.push(['','','','','']);

    if (otherInfo)
        otherInfo.forEach((cat) => 
            ledger_sheet.push(['OtherName', 'OtherType', '', 'OtherStatementCycle', 'OtherLastReconciled'].map((field) => cat[field] || '')));
            ledger_sheet.push(['','','','','']);

    // access Google APIs on behalf of gswfp
    gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
        .then((auth) => 
            // check to see if folder exists for specific client
            ls({ auth, name: name + ' Files', parent: CLIENT_FILES })
            .then((folder) => 
                // create the new folder if not, return folder data
                new Promise((resolve) =>
                    folder.data.files.length ?
                        resolve({ data: folder.data.files[0] }) :
                        mkdir({ auth, name, parents: [CLIENT_FILES] }).then(resolve))
            )
            .then((file) =>
                // create the ledger sheet in the new client folder
                mksheet({
                    auth, 
                    name: name + ' Account Ledger',
                    parents: [file.data.id],
                    range: `Sheet1!1:${ledger_sheet.length}`,
                    values: ledger_sheet
                })
            )
            // get some better success/error handling here
            .then((sheet) => res.send({ messages: 'received' }))
            .catch((err) => {
                console.log(err);
                return res.send({ messages: 'received' });
            })
        );
}

var mkdir_if_none = ({ auth, name, parent }) =>
    // check to see if folder exists for specific client
    ls({ auth, name, parent })
        .then((folder) => 
            // create the new folder if not, return folder data
            new Promise((resolve) =>
                folder.data.files.length ?
                    resolve({ data: folder.data.files[0] }) :
                    mkdir({ auth, name, parents: [parent] }).then(resolve))
        );


/*var filegen_post = (req, res, next) {
    var name = req.data.name;
    gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
        .then((auth) => 
            mkdir_if_none({ auth, name, parent: CLIENT_FILES })
                // structure Financial Documents directory 
                .then((folder) =>
                    mkdir_if_none({ auth, name: 'Financial Documents', parent: folder.data.id })
                        // add four years' worth of folders (or however many years requested in SOW)
                        .then((FD) => {
                            var year = moment(Date.now()).year();
                            var years = Array(4).map((_, ind) => (year - ind);
                                
                                .reduce((promise_acc, yr) =>
                                    promise_acc
                                        .then((prev) => mkdir_if_none({ auth, name: yr.toString(), parent: FD.data.id }))
                                )
                                */
                            
                             

                       
  

module.exports = {
    ledger: {
        get: ledger_get,
        post: ledger_post
    }
};
