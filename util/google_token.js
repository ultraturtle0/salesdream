const tokenName = 'googleAPI';
const jwt = require('jsonwebtoken');

// MOVE THESE TO CONFIG FILE
const TOKEN_ROOT = __dirname + '/../config/tokens/';
/*const TOKEN_PATH = {
    'Ledger Generator': TOKEN_ROOT + `${tokenName}`,
    'Calendaring': ;
};*/
//const TOKEN_CONFIG = require(`${TOKEN_PATH}_gen.json`);

const { google } = require('googleapis');
const fs = require('fs');

// MOVE THIS TO CONFIG FILE
const scopes = [
    // Google Docs - spreadsheets
    //"https://www.googleapis.com/auth/spreadsheets",
    // Google Drive - full access
    //"https://www.googleapis.com/auth/drive",
    // Google Calendar - read only
    // 'https://www.googleapis.com/auth/calendar'
    //"https://www.googleapis.com/auth/gmail.send"
].join(' ');

var loadToken = (app, subject) => 
    //const token = JSON.parse(fs.readFileSync(FULL_PATH, 'utf8'));
    google.auth.getClient({
        keyFile: TOKEN_ROOT + app + '_gen.json',
        scopes 
    })
    .then((auth) => {
        auth.subject = subject;
        console.log('authorization successful');
        return new Promise((resolve, reject) => resolve(auth));
    });

var genToken = (app, subject) => {
    const TOKEN_CONFIG = require(`${TOKEN_ROOT}${app}_gen.json`);

    return new google.auth.JWT(
        TOKEN_CONFIG.client_email,
        {
            access_type: 'offline',
        },
        TOKEN_CONFIG.private_key,
        scopes
    )
    .authorize()
        .then((tokens) => {
            fs.writeFileSync(TOKEN_ROOT + app + '.json', JSON.stringify(tokens));
            console.log('token generated');
            console.log(tokens);
            return loadToken(app, subject);
        })   
        .catch((err) => {
            console.log("Error authorizing Google API token:");
            console.log(err);
        });
}



    

module.exports = (app, subject) => 
    fs.existsSync(TOKEN_ROOT + app + '.json') ? 
        loadToken(app, subject) :
        genToken(app, subject);







