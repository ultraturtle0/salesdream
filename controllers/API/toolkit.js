var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');

var ledger_get = (req, res, next) => 
    axios.get(`http://${config.domain}:${9601}/api/sf/Account`,
        { params: { fields: "Id, Name" } }
    )
        .then((response) => {
            /*if (res.data.errors) {
                console.log(res.data.errors);
                res.status(500).send({ errors: [res.data.errors] });
            };
            */
            console.log(response.data);
            res.status(200).send({ accounts: response.data });
        })
        .catch((err) => {
            console.log('THIS FAILS');
            console.log(err);
            res.status(500).send({ errors: [err] });;
        });

var ledger_post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var { cardInfo, bankInfo, otherInfo, name } = req.body;

    // set column headers
    var ledger_sheet = [['Account Name', 'Account Type', 'Bank Name', 'Statement Cycle', 'Last Reconciliation Date']];

    if (cardInfo) {
        cardInfo.forEach((cat) => 
            ledger_sheet.push(['CardName', 'CardType', 'CardBank', 'CardStatementCycle', 'CardLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);
    };

    if (bankInfo) {
        bankInfo.forEach((cat) => 
            ledger_sheet.push(['BankName', 'BankType', 'Bank', 'BankStatementCycle', 'BankLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);
    };

    if (otherInfo) {
        otherInfo.forEach((cat) => 
            ledger_sheet.push(['OtherName', 'OtherType', '', 'OtherStatementCycle', 'OtherLastReconciled'].map((field) => cat[field] || '')));
        ledger_sheet.push(['','','','','']);
    };

    // access Google APIs on behalf of gswfp
    new gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
        .auth()
        .then((auth) => {
            const sheets = google.sheets({version: 'v4', auth });
            const drive = google.drive({version: 'v3', auth });
            // create new spreadsheet
            return sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title: name + ' Account Ledger' 
                    }
                },
                fields: 'spreadsheetId'
            })
            .then((response) => 
                // update cells in sheet
                sheets.spreadsheets.values.update({
                    spreadsheetId: response.data.spreadsheetId,
                    range: `Sheet1!1:${ledger_sheet.length}`,
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: ledger_sheet
                    }
                })
                // find sheet using drive API
                .then((sheet) => drive.files.get({
                    fileId: response.data.spreadsheetId,
                    fields: 'id, parents'
                }))
                // check for specific client folder
                .then((sheet) => 
                    drive.files.list({
                        q: `(name='${name} Files') and ('${config.g_drive.folders.client_files}' in parents)`,
                        fields: 'files(id)'
                    })
                    .then((folder) => {
                        const files = folder.data.files;
                        var cb = (client) => 
                            drive.files.update({
                                fileId: sheet.data.id,
                                addParents: client.data.id,
                                removeParents: sheet.data.parents.join(','),
                                fields: 'id'
                            });
                        if (!folder.data.files.length) {
                            // STILL NOT PUTTING IN CLIENT FILES FOLDER. HM
                            return drive.files.create({
                                resource: {
                                    'name': name + ' Files',
                                    'mimeType': 'application/vnd.google-apps.folder',
                                    'parents': [config.g_drive.folders.client_files]
                                },
                                fields: 'id'
                            })
                            .then(cb);
                        } else {
                            return cb({data: files[0]});
                        }
                    })
                )
            );
        })
        .then((file) => res.send({ messages: 'received' }))
        .catch((err) => {
            console.log(err);
            return res.send({ messages: 'received' });
        });
};

module.exports = {
    ledger: {
        get: ledger_get,
        post: ledger_post,
    },
};
