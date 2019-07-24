const tokenName = 'googleAPI';
const jwt = require('jsonwebtoken');
const { GoogleAuth } = require('google-auth-library');

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
const scopes = {
    'calendaring': [
        'https://www.googleapis.com/auth/calendar',
    ].join(' '),
    'ledger-generator': [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ].join(' '),
    'emailer': [
        'https://mail.google.com'
    ].join(' ')
};

module.exports = class gauth {
    constructor(app, subject) {
        this.app = app;
        this.subject = subject;
    }

    auth() {
        return fs.existsSync(TOKEN_ROOT + this.app + '.json') ? 
            this.loadToken() :
            this.genToken();
    }

    loadToken() {
        return (new GoogleAuth).getClient({
            keyFile: TOKEN_ROOT + this.app + '_gen.json',
            scopes: scopes[this.app] 
        })
        .then((auth) => {
            auth.subject = this.subject;
            console.log('authorization successful');
            return new Promise((resolve, reject) => resolve(auth));
        });
    }

    genToken() {
        const TOKEN_CONFIG = require(`${TOKEN_ROOT}${this.app}_gen.json`);
        return (new google.auth.JWT(
            TOKEN_CONFIG.client_email,
            {
                access_type: 'offline',
            },
            TOKEN_CONFIG.private_key,
            scopes[this.app]
        ))
            .authorize()
            .then((tokens) => fs.writeFileSync(TOKEN_ROOT + this.app + '.json', JSON.stringify(tokens)))
            .then((_) => this.loadToken())
            .catch((err) => {
                console.log("Error authorizing Google API token:");
                console.log(err);
            });
    }
}









