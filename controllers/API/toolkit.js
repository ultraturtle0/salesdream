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

var ledger_post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var { cardInfo, bankInfo, otherInfo, name } = req.body;

    var ledger_sheet = [];
    cardInfo.forEach((cat) => 
        ledger_sheet.push(['CardName', 'CardType', 'CardBank', 'CardStatementCycle', 'CardLastReconciled'].map((field) => cat[field])));
    ledger_sheet.push(['','','','','']);

    bankInfo.forEach((cat) => 
        ledger_sheet.push(['BankName', 'BankType', 'Bank', 'BankStatementCycle', 'BankLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);

    otherInfo.forEach((cat) => 
        ledger_sheet.push(['OtherName', 'OtherType', '', 'OtherStatementCycle', 'OtherLastReconciled'].map((field) => cat[field] || '')));
        ledger_sheet.push(['','','','','']);

    // access Google APIs on behalf of gswfp
    gauth('gswfp@gswfinancialpartners.com')
        .then((auth) => {
            sheets = google.sheets({version: 'v4', auth });
            sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title: name + ' Account Ledger' 
                    }
                },
                fields: 'spreadsheetId'
            }, (err, response) => {
                if (err) {
                    // Handle error.
                    console.log(err);
                } else {
                    sheets.spreadsheets.values.update({
                        spreadsheetId: response.data.spreadsheetId,
                        range: `Sheet1!1:${ledger_sheet.length}`,
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: ledger_sheet
                        }
                    }, (err, result) => {
                          if (err) console.log(err)
                              else {
                                  console.log(result);
                                  console.log('%d cells updated.', result.updatedCells);
                              }
                    });
                    console.log(response.data);
                };
                return res.send({ messages: 'received' });
            });
        })
        .catch((err) => {
            console.log(err);
            return res.send({ messages: 'received' });
        });
}

/*
 * sheets = google.sheets({version: 'v4', auth });
        drive = google.drive({version: 'v2', auth });

        sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: 'new sheet!'
                }
            },
            fields: 'spreadsheetId'
        }, (err, res) => {
            if (err) {
                // Handle error.
                console.log(err);
            } else {
                var spreadsheet = res.data;
                console.log(res.data);
                drive.files.get({
                    fileId:spreadsheet.spreadsheetId,
                    fields: 'parents'
                }, (err, file) => {
                    var parents = file.data.parents
                        .map((parent) => parent.id)
                        .join(',');
                

                drive.files.update({
                    fileId: spreadsheet.spreadsheetId,
                    addParents: '1dy7j2LkWtrY-IMF7GBgFbEgMCwEU5pLu',
                    removeParents: parents,
                    fields: 'id, parents'
                }, (err, file) => {
                    if (err) console.log(err)
                    else console.log(file);
                })});



            };
        });
*/

module.exports = {
    ledger: {
        get: ledger_get,
        post: ledger_post
    }
};
