const { google } = require('googleapis');
const gauth = require('./util/google_token.js');

const surveyEmail = require('./config/emails/hello_world.js');

const body = {
    hello: 'hello world'
}
const link = {
    hello: 'hello world'
}
gauth('emailer', 'gswfp@gswfinancialpartners.com')
                .then((auth) => 
                    google.gmail({
                        version: 'v1',
                        auth
                    })
                    .users.messages.send({
                        userId: 'me',
                        requestBody: {
                            raw: surveyEmail({ body, link })
                        }
                    })
                )
/*gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
                .then((auth) => 
                    google.sheets({
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
            })
            .then((res) => console.log(res))
            .catch(err => console.error(err))

                )
                .catch(err => console.error(err));
                */
                

