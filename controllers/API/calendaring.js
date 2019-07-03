const { google } = require('googleapis');
const config = require('../../config/config');
const readline = require('readline');
const fs = require('fs');
const testemail = require('../../config/emails/hello_world.js');
var moment = require('moment');
var axios = require('axios');

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6InNtbEtRbmUyUUxxTUx5b2hGdTI5YXciLCJleHAiOjE1NjIxODE4NTIsImlhdCI6MTU2MjE3NjQ1Mn0.BpziK9rLMIa-9cSbLYPU0H56gXC5TfLpnGQi6geQtX8";


const gauth = require('../../util/google_token');

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
                //console.log (events);

                events.forEach((event) => {
                  console.log(event);
                  if (event.location){
                    console.log(event.location);
                    event.travelTime = 60;
                    console.log(event.travelTime);
                  };
                });
                

                /*var j = 0;
                  for(j; j < events.length; j++){
                    console.log("EVENT " + (j+1) + " (but for array index purposes array " + j + "):");
                    console.log(events[j].start.dateTime);
                    console.log(events[j].end.dateTime);
                    if(j != 0){
                      if((moment(events[j-1].end.dateTime)).isBefore(moment(events[j].start.dateTime))){
                        console.log("event " + (j+1) + " (index: " + j + ") does not overlap with event " + j + " (index: " + (j-1) + ")!");
                        console.log(((moment.duration((moment(events[j-1].end.dateTime)).diff((moment(events[j].start.dateTime))))).asMinutes()));
                        if(((moment.duration((moment(events[j-1].end.dateTime)).diff((moment(events[j].start.dateTime))))).asMinutes()) > -30 ) {
                          console.log("WARNING!!! event " + (j+1) + " (index: " + j + ") is less than 30 MINUTES before event " + j + " (index: " + (j-1) + ")!");
                          console.log(((moment.duration((moment(events[j-1].end.dateTime)).diff((moment(events[j].start.dateTime))))).asMinutes()));
                        };
                      }else{
                        console.log("ALERT!!! event " + (j+1) + " (index: " + j + ") DOES OVERLAP with event " + j + " (index: " + (j-1) + ")!");
                        console.log(((moment.duration((moment(events[j-1].end.dateTime)).diff((moment(events[j].start.dateTime))))).asMinutes()));
                      };
                    };
                  };*/

                if (events.length) {
                  events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    const end = event.end.dateTime || event.end.date;
                    return {data: `${start} - ${event.summary}`};
                  });
                  return res.send({data: events, currentDate, numberOfWeeks});
                } else {
                  //events == ;
                    //return res.send({message: 'no upcoming events found'}, {data: events, currentDate, numberOfWeeks});
                    return res.send({data: events, currentDate, numberOfWeeks});
                }
              });
        });
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

var post = (req, res, next) => {
    console.log('Calendar Sumbitted.');
    var googleParameters = req.body.data;
    console.log(googleParameters);
    var zoomParameters = req.body.zoomParameters;
    console.log(zoomParameters);
    var subject = googleParameters.firstName + " " + googleParameters.lastName + " - Introductory Zoom Call";
    var event = {
      'summary': subject,
      'description': googleParameters.description,
      'start': {
        'dateTime': googleParameters.startEvent,
      },
      'end': {
        'dateTime': googleParameters.endEvent,
      },
      'attendees': [
        {'email': 'gabriella@gswfinancialpartners.com'},
        {'email': googleParameters.emailAddress},
      ],
    };
    var options = {
      uri: "https://api.zoom.us/v2/users/gabriella@gswfinancialpartners.com", 
      qs: {
          status: 'active' 
      },
      auth: {
        'bearer': token
      },
      headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'content-type': 'application/json'
      },
      json: true, //Parse the JSON string in the response
    };
    axios.post(('https://api.zoom.us/v2/users/'userID'/meetings'), //I think we need a user id
      {
        headers: {
          token
        },
        data: {
          options,
          'topic': subject,
          'type': 2,
          'start_time': zoomParameters.startEvent,
          'duration': zoomParameters.duration
        }

      })
      .then((response) => {
        console.log("SUCCESS!");
        console.log('User has', response);
        console.log(res.id);
        return res.id;
      })
      .catch((err) => {
        // API call failed...
        console.log('API call failed, reason ', err);
      });
    gauth('calendaring', 'gswfp@gswfinancialpartners.com')
      .then((auth) => {
        const calendar = google.calendar({ version: 'v3', auth })
        return calendar.events.insert({
          auth,
          calendarId: 'primary',
          resource: event,
        })
      })
      .then((event) => {
        console.log('Event created: %s', event.htmlLink);
        res.send({ messages: ['event successfully created']});
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ errors: [err] });
      });
};

    


module.exports = {
    post,
    get
};

