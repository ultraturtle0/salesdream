//module.exports = (tokenName, apiName, scopes) => {
async function hi() {
    var tokenName = 'gsheet';
    const jwt = require('jsonwebtoken');
    const token_config = require(`../config/tokens/${tokenName}_gen.json`);

    const TOKEN_PATH = __dirname + `/../config/tokens/${tokenName}.json`;

    const { google } = require('googleapis');
    const fs = require('fs');
    if (fs.existsSync(TOKEN_PATH)) {
        var token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        google.auth.getClient({
            keyFile: __dirname + `/../config/tokens/${tokenName}_gen.json`,
            scopes: ["https://www.googleapis.com/auth/spreadsheets","https://www.googleapis.com/auth/drive"]
        })
        .then((auth) => {
            auth.subject = 'gswfp@gswfinancialpartners.com';
        //auth.setCredentials(token);
        sheets = google.sheets({version: 'v4', auth });
        drive = google.drive({version: 'v2', auth });

        sheets.spreadsheets.create({
            resource: {
                properties: {
                    title: 'new sheet!'
                }
            },
            fields: 'spreadsheetId'
        }, (err, res) => {
            var spreadsheet = res.data;
            if (err) {
                // Handle error.
                console.log(err);
            } else {
                drive.files.get({
                    fileId:spreadsheet.spreadsheetId,
                    fields: 'parents'
                })
                .then((file) =>

                drive.files.update({
                    fileId: spreadsheet.spreadsheetId,
                    addParents: '1dy7j2LkWtrY-IMF7GBgFbEgMCwEU5pLu',
                    removeParents: file.data.parents.join(','),
                    fields: 'id, parents'
                }, (err, file) => {
                    if (err) console.log(err)
                    else console.log(file)
                }));



            };
        });
        });
    } else {


        var jwtClient = new google.auth.JWT(
            token_config.client_email,
            {
                access_type: 'offline',
            },
            token_config.private_key,
            ["https://www.googleapis.com/auth/spreadsheets"]
        );

        jwtClient.authorize((err, tokens) => {
            if (err) {
                console.error(err);
            } else {
                fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            };
        });

    };
};

hi();




