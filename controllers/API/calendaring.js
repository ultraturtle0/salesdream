const { google } = require('googleapis');
const config = require('../../config/config');
const readline = require('readline');
const fs = require('fs');
const testemail = require('../../config/emails/hello_world.js');
var moment = require('moment');
var currentDate = moment()
                    .add(3, 'days')
                    .startOf('day')
                    .toDate();
console.log(currentDate);
var twoWeeksDate = (moment(currentDate).add(14, 'days')).toDate();
console.log(twoWeeksDate);

const gauth = require('../../util/google_token');

var get = (req, res, next) => {
    gauth('calendaring', 'gswfp@gswfinancialpartners.com')
        .then((auth) => {
            const calendar = google.calendar({ version: 'v3', auth });
            calendar.events.list({
                calendarId: 'primary',
                timeMin: currentDate,
                timeMax: twoWeeksDate,
                singleEvents: true,
                orderBy: 'startTime',
              }, (err, g_res) => {
                console.log(err);
                //if (err) return res.status(400).send({error: 'error retrieving google calendar information'}); 
                const events = g_res.data.items;
                var j = 0;
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
                  };

                if (events.length) {
                  events.map((event, i) => {
                    const start = event.start.dateTime || event.start.date;
                    const end = event.end.dateTime || event.end.date;
                    return {data: `${start} - ${event.summary}`};
                  });
                  return res.send({data: events, currentDate});
                } else {
                    return res.send({message: 'no upcoming events found'});
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

    


module.exports = {
    post,
    get
};

