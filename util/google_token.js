const tokenName = 'googleAPI';
const jwt = require('jsonwebtoken');

// MOVE THESE TO CONFIG FILE
const TOKEN_PATH = __dirname + `/../config/tokens/${tokenName}`;
const TOKEN_CONFIG = require(`${TOKEN_PATH}_gen.json`);

const { google } = require('googleapis');
const fs = require('fs');

// MOVE THIS TO CONFIG FILE
const scopes = [
    // Google Docs - spreadsheets
    "https://www.googleapis.com/auth/spreadsheets",
    // Google Drive - full access
    "https://www.googleapis.com/auth/drive",
    // Google Calendar - read only
    //'https://www.googleapis.com/auth/calendar.readonly'
];

var loadToken = (subject) => 
    //const token = JSON.parse(fs.readFileSync(FULL_PATH, 'utf8'));
    google.auth.getClient({
        keyFile: TOKEN_PATH + '_gen.json',
        scopes 
    })
    .then((auth) => {
        auth.subject = subject;
        console.log('authorization successful');
        return new Promise((resolve, reject) => resolve(auth));
    });

var genToken = (subject) => 
    new google.auth.JWT(
        TOKEN_CONFIG.client_email,
        {
            access_type: 'offline',
        },
        TOKEN_CONFIG.private_key,
        scopes
    )
    .authorize()
        .then((tokens) => {
            fs.writeFileSync(TOKEN_PATH + '.json', JSON.stringify(tokens));
            console.log('token generated');
            console.log(tokens);
            return loadToken(subject);
        })   
        .catch((err) => {
            console.log("Error authorizing Google API token:");
            console.log(err);
        });



    

module.exports = (subject) => 
    fs.existsSync(TOKEN_PATH + '.json') ? 
        loadToken(subject) :
        genToken(subject);







