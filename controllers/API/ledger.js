var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');


var post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var body = req.body;

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
                    console.log(response.data);
                };
                return res.send({ message: 'received' });
            });
        })
        .catch((err) => {
            console.log(err);
            return res.send({ message: 'received' });
        });
}


module.exports = {
    //get,
    post
};

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
