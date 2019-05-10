const { google } = require('googleapis');
const config = require('../../config/config');
const readline = require('readline');
const fs = require('fs');

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = __dirname + '/../../config/tokens/calendar_token.json';

const google_auth = () => {
    const { client_secret, client_id, redirect_uris } = config.g_calendar.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
};

var post = (req, res, next) => {
    // THIS RE-AUTHORIZES THE GOOGLE API EVERY REQUEST.
    // IS THIS WHAT YOU REALLY WANT?
    var auth = google_auth();
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, g_res) => {
        console.log(err);
        //if (err) return res.status(400).send({error: 'error retrieving google calendar information'}); 
        const events = g_res.data.items;
        if (events.length) {
          console.log('Upcoming 10 events:');
          events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            return res.send({data: `${start} - ${event.summary}`});
          });
        } else {
            return res.send({message: 'no upcoming events found'});
        }
      });
};

    


module.exports = {
    post,
    //get,
};
