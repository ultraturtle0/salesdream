const { google } = require('googleapis');
const config = require('../../config/config');
const readline = require('readline');
const fs = require('fs');
const testemail = require('../../config/emails/hello_world.js');

const gauth = require('../../util/google_token');

var get = (req, res, next) => {

    gauth('emailer', 'jordan@gswfinancialpartners.com')
        .then((auth) =>
            google.gmail({
                version: 'v1',
                auth
            })
            .users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: testemail()
                }
            })
        )
        .then((res) => {
            console.log(res);
            res.send({});
        });


            
    /*gauth('calendaring', 'gswfp@gswfinancialpartners.com')
        .then((auth) => {
            const calendar = google.calendar({ version: 'v3', auth });
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
        });
        */
    
};

var post = (req, res, next) => {
    gauth('gswfp@gswfinancialpartners.com')
        .then((auth) => {
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
        });
};

    


module.exports = {
    post,
    get
};
