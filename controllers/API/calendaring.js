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
    var zoomID = 0;

    // start new Zoom meeting
    axios.post(`https://api.zoom.us/v2/users/${zoom_config.userID}/meetings?access_token=${zoom_token}`, 
        {
            'topic': subject,
            'type': 2,
            'start_time': data.startEvent,
            'duration': data.duration
        }
    )
        .then((response) => {
          //zoomID = response.data.id;
            gauth('calendaring', 'gswfp@gswfinancialpartners.com')
              // create new Google Calendar event
              .then((auth) => {
                console.log('google authorized');
                var event = {
                  'summary': subject,
                  'description': 'Zoom Meeting ID: ' + zoomID,
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
              .then((response2) => {

                gauth('emailer', 'gswfp@gswfinancialpartners.com')
                  .then((auth) => 
                    google.gmail({
                      version: 'v1',
                      auth
                    })
                    .users.messages.send({
                      userId: 'me',
                      requestBody: {
                        raw: zoomEmail({
                          FirstName: data.firstName,
                          LastName: data.lastName,
                          Email: data.emailAddress,
                          time: moment(data.startEvent).format("h:mm A"),
                          date: moment(data.startEvent).format("MMMM Do, YYYY"),
                          code: zoomID,
                        })
                      }
                    })
                )
                .catch((err) => {
                  console.log('error here', err);
                  console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
                  console.log(err.data);
                });
              })
              .then((email) => res.status(200).send({ messages: ['event successfully created']}))
              .catch((err) => console.log('error here', err))
            })
};

module.exports = {
    post,
    get
};

