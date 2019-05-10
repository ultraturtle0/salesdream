var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');

//var gen_ledger = (ledger) => [[...Array(5).keys()], [...Array(5).keys()]];

var ledger_post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var ledger = req.body;

    var ledger_sheet = ['Bank', 'Card', 'Other'].map((type) => 
        [
            ['', 'LastReconciled','Name', 'StatementCycle', 'Type'].map(
                (field) => ledger[type.toLowerCase() + 'Info'].map(
                    (cat) => [cat[type + field]]
                )
                //(field) => ledger[type.toLowerCase() + 'Info'][type + field]
            ),
            ['','','','','']
        ]);
    
    console.log(ledger_sheet);

/*
    // access Google APIs on behalf of gswfp
    gauth('gswfp@gswfinancialpartners.com')
        .then((auth) => {
            sheets = google.sheets({version: 'v4', auth });
            sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title: 'A WHOLE NEW sheet!' 
                    }
                },
                fields: 'spreadsheetId'
            }, (err, response) => {
                if (err) {
                    // Handle error.
                    console.log(err);
                } else {
                    var spreadsheet = response.data;
                    var values = gen_ledger(req.body);
                    console.log(values);
                    sheets.spreadsheets.values.update({
                        spreadsheetId: response.data.spreadsheetId,
                        range: 'Sheet1!1:5',
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values
                        }
                    }, (err, result) => {
                          if (err) {
                                   console.log(err);
                                     } else {
                                         console.log(result);
                                         console.log('%d cells updated.', result.updatedCells);
                                           }
                                           });
                    console.log(response.data);
                };
                return res.send({ message: 'received' });
            });
        })
        .catch((err) => {
            console.log(err);
            return res.send({ message: 'received' });
        });
        */
    return res.send('ok');
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
        post: ledger_post
    }
};
