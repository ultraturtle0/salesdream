const { google } = require('googleapis');
const gauth = require('./util/google_token.js');
const assert = require('assert');

const surveyEmail = require('./config/emails/hello_world.js');

const body = {
    hello: 'hello world'
}
const link = {
    hello: 'hello world'
}

new gauth('emailer', 'gswfp@gswfinancialpartners.com')
    .auth()
                .then((auth) => {
                    console.log(auth);
                    const gmail = google.gmail({
                        version: 'v1',
                        auth
                    })
                    .users.messages.send({
                        userId: 'me',
                        requestBody: {
                            raw: surveyEmail({ body, link })
                        }
                    });
                    return gmail;
                })
                .catch((err) => console.error(err));


return new gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
    .auth()
        .then((auth) => {
            const sheets = google.sheets({
                version: 'v4',
                auth
            })
            .spreadsheets.create({
                resource: {
                    properties: {
                        title: 'super' + ' Account Ledger' 
                    }
                },
                fields: 'spreadsheetId'
            });
            return sheets;
        })
        .catch(err => console.error(err));

