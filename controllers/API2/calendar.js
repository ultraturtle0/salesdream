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
    new gauth('calendaring', 'gswfp@gswfinancialpartners.com')
        .auth()
        // create new Google Calendar event
        .then((auth) =>
            google.calendar({ version: 'v3', auth })
                .events.insert({
                    auth,
                    calendarId: 'primary',
                    resource: req.body.event,
                })
        )
        .then((event) => res.send({ event }));
};

module.exports = {
    post,
    get
};

