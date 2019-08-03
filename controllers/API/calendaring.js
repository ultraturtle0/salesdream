const { google } = require('googleapis');
const zoom_config = require('../../config/config').zoom;
const readline = require('readline');
const fs = require('fs');
const zoomEmail = require('../../config/emails/zoom.js');
var moment = require('moment');
var axios = require('axios');
var jwt = require('jsonwebtoken');

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
    new gauth('calendaring', 'gswfp@gswfinancialpartners.com')
        .auth()
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
    console.log(req.body);
    if (req.body.laterDate === 'true') {
        return next();
    };
    var errors = [];
    var data = ['FirstName', 'LastName', 'Email']
        .reduce((acc, key) => {
            acc[key] = req.body[key] || errors.concat('Missing field: ' + key); //res.status(403).send({ errors: ['Missing field: ' + key] });
            return acc;
        }, {});
    //errors ? res.status(403).send({ errors }) : false;
    data.startEvent = req.body.startEvent;
    var subject = data.FirstName + " " + data.LastName + " - Introductory Zoom Call";
    console.log(data);
    // start new Zoom meeting
    axios.post(`https://api.zoom.us/v2/users/${zoom_config.userID}/meetings?access_token=${zoom_token}`, 
        {
            'topic': subject,
            'type': 2,
            'start_time': data.startEvent,
            'duration': 60
        })
        .then((zoom_res) => {
            req.body.Zoom_Meeting_ID = zoom_res.data.id;
            return new gauth('calendaring', 'gswfp@gswfinancialpartners.com')
                .auth()
                // create new Google Calendar event
                .then((auth) => {
                    console.log('google authorized');
                    var event = {
                      'summary': subject,
                      'description': 'Zoom Meeting ID: ' + zoom_res.data.id,
                      'start': {
                        'dateTime': data.startEvent,
                      },
                      'end': {
                        'dateTime': moment(data.startEvent)
                            .add(1, 'hours')
                            .format('YYYY-MM-DDTHH:mm:ssZ')
                      },
                      'attendees': [
                        {'email': 'gabriella@gswfinancialpartners.com'},
                        {'email': data.Email,
                        //'comment': 'would love to see you there can u make it?',
                        }
                      ],
                    };
                    const calendar = google.calendar({ version: 'v3', auth });
                    return calendar.events.insert({
                      auth,
                      calendarId: 'primary',
                      resource: event,
                    });
                });
        }) 
        .then((event) => {
            req.messages = (req.messages || []).concat('event successfully created');
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ errors: [err] });
        });
};

module.exports = {
    post,
    get
};

