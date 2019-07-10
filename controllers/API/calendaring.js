const { google } = require('googleapis');
const zoom_config = require('../../config/config').zoom;
const readline = require('readline');
const fs = require('fs');
const testemail = require('../../config/emails/hello_world.js');
var moment = require('moment');
var axios = require('axios');
var jwt = require('jsonwebtoken');


const temporary = {
    production: {
        APIKey: 'smlKQne2QLqMLyohFu29aw',
        APISecret: 'FkTnmLvQU0LeOKiDxXI1syPoc11ryyeEmZXQ'
    }
};

const zoom_token = jwt.sign({
        iss: zoom_config.production.APIKey,
        exp: ((new Date()).getTime() + 5000)
    }, zoom_config.production.APISecret);

const gauth = require('../../util/google_token');

//Get Request - get event information from google calendar
var get = (req, res, next) => {
    var currentDate = moment(req.query.startDate).toDate();
    console.log("CURRENT DATE");
    console.log(currentDate);

    var numberOfWeeks = 4;
    var endDate = (moment(currentDate).add(numberOfWeeks, 'weeks')).toDate();
    console.log(endDate);
    gauth('calendaring', 'gswfp@gswfinancialpartners.com')
        .then((auth) => {
            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.list({
                calendarId: 'primary',
                timeMin: currentDate,
                timeMax: endDate,
                singleEvents: true,
                orderBy: 'startTime',
              }, (err, g_res) => {
                console.log(err);
                //if (err) return res.status(400).send({error: 'error retrieving google calendar information'}); 
                const events = g_res.data.items;

                events.forEach((event) => {
                  if (event.location){
                    event.travelTime = 60;
                  };
                });

                if (events.length) {
                  events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    const end = event.end.dateTime || event.end.date;
                    return {data: `${start} - ${event.summary}`};
                  });
                  return res.send({data: events, currentDate, numberOfWeeks});
                } else {
                    return res.send({data: events, currentDate, numberOfWeeks});
                }
              });
        });
};

var post = (req, res, next) => {
    console.log('Calendar Submitted.');
    data = req.body;
    var subject = data.firstName + " " + data.lastName + " - Introductory Zoom Call";

    // start new Zoom meeting
    axios.post(`https://api.zoom.us/v2/users/${zoom_config.userID}/meetings?access_token=${zoom_token}`, 
        {
            'topic': subject,
            'type': 2,
            'start_time': data.startEvent,
            'duration': data.duration
        }
    )
        .then((response) => 
            gauth('calendaring', 'gswfp@gswfinancialpartners.com')
              // create new Google Calendar event
              .then((auth) => {
                console.log('google authorized');
                var event = {
                  'summary': subject,
                  'description': 'Zoom Meeting ID: ' + response.data.id,
                  'start': {
                    'dateTime': data.startEvent,
                  },
                  'end': {
                    'dateTime': data.endEvent,
                  },
                  'attendees': [
                    {'email': 'gabriella@gswfinancialpartners.com'},
                    {'email': data.emailAddress},
                  ],
                };
                const calendar = google.calendar({ version: 'v3', auth })
                return calendar.events.insert({
                  auth,
                  calendarId: 'primary',
                  resource: event,
                });
              })
              .then((event) => {
                console.log('Event created: %s', event.htmlLink);
                res.send({ messages: ['event successfully created']});
              })
        )
        .catch((err) => {
            console.log(err);
            res.status(400).send({ errors: ['error creating event', err] });
        });
};


module.exports = {
    post,
    get
};

