// based on the guide from https://developers.google.com/gmail/api/quickstart/nodejs

const { google } = require('googleapis');
const config = require('../config/config');
const fs = require('fs');
const readline = require('readline');
var Promise = require('bluebird');

const TOKEN_PATH = 'gmail_token.json';
const SCOPES = ['https://www.googleapis.com/auth/gmail.compose'];

var listLabels = (auth) => {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.labels.list({
        userId: 'me',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
            console.log('Labels:');
            labels.forEach((label) => {
                console.log(`- ${label.name}`);
            });
        } else {
            console.log('No labels found.');
        }
    });
}

var send = (auth, email) => {
    console.log(email);
    const gmail = google.gmail({version: 'v1', auth}); 
    gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: email,
        },
    });
}

var getNewToken = (oAuth2Client) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve(code);
        });
    })
    .then((code) => {
        return new Promise((resolve, reject) => {
            oAuth2Client.getToken(code, (err, token) => {
                if (err) reject(`Error retrieving access token: ${err}`);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) reject(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                resolve(oAuth2Client);
            });
        });
    });
}

var authorize = () => {
    const { client_secret, client_id, redirect_uris } = config.gmail.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    return new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) reject(getNewToken(oAuth2Client));
            resolve(token);
        });
    })
    .then((token) => {
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    });
}

// Check if we have previously stored a token.

module.exports = {
    authorize: authorize,
    send: send
}
