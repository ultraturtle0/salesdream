const axios = require('axios');
const jwt = require('jsonwebtoken');
const base64url = require('base64url');
const token_config = require('../config/tokens/ledger-generator-553e66a4bfbd.json');

const TOKEN_PATH = __dirname + '/../config/tokens/gsheet_token.json';

const { google } = require('googleapis');
const fs = require('fs');
if (fs.existsSync(TOKEN_PATH)) {
    var token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    console.log(token);
} else {

//fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {


const jwtClient = new google.auth.JWT(
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
    };;
});

};



/*var now = Date.now()/1000;

var payload = [
    base64url(`{"alg":"RS256","typ":"JWT"}`),
    base64url(`{
        "iss":"${token_config.client_email}",
        "scope":"https://www.googleapis.com/auth/spreadsheets",
        "aud":"https://www.googleapis.com/oauth2/v4/token",
        "exp":${now+3600},
        "iat":${now}
    }`)
].join('.');

var sig = base64url(jwt.sign(payload, token_config.private_key, { algorithm: 'RS256' }));

var assertion = [payload, sig].join('.');


axios.post('https://www.googleapis.com/oauth2/v4/token', 
    { 
        params: {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion
        }
    })
    .then((res) => console.log(res))
    .catch(err => console.error(err));

function getNewToken(oAuth2Client, callback) {
                        oAuth2Client.setCredentials(token);
                        // Store the token to disk for later program executions
                  //       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  //               if (err) return console.error(err);
                  //                       console.log('Token stored to', TOKEN_PATH);
                  //                             });
                  //                                   callback(oAuth2Client);
                  //                                       });
                  //                                         });
                  //                                         }
                  //                                       
    //                                       */
