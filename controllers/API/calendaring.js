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
    var data = {
        firstName : req.body.firstName, 
        lastName : req.body.lastName, 
        startEvent : req.body.startEvent, 
        endEvent : req.body.endEvent, 
        emailAddress : req.body.emailAddress, 
        duration ; req.body.duration
        };
    var validation = true;
    Object
        .keys()
        .forEach((key) => {
          if (!data[key]) validation = false 
        });
    if (validation == true){
        var subject = data.firstName + " " + data.lastName + " - Introductory Zoom Call";
        var zoomID;


        // start new Zoom meeting
        axios.post(`https://api.zoom.us/v2/users/${zoom_config.userID}/meetings?access_token=${zoom_token}`, 
            {
                'topic': subject,
                'type': 2,
                'start_time': data.startEvent,
                'duration': data.duration
            }
        )
    <<<<<<< HEAD
            .then((response) => {
                gauth('calendaring', 'gswfp@gswfinancialpartners.com')
                  // create new Google Calendar event
                  .then((auth) => {
                    zoomID = response.data.id;
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
                  .then((calendar_res) => 
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
                    //.catch((err) => console.log('error here', err));
                  )
                  .then((email) => res.status(200).send({ messages: ['event successfully created']}))
                  .catch((err) => console.log('error here', err))
                })
    =======
            .then((zoom_res) =>
                new gauth('calendaring', 'gswfp@gswfinancialpartners.com')
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
                            'dateTime': data.endEvent,
                          },
                          'attendees': [
                            {'email': 'gabriella@gswfinancialpartners.com'},
                            {'email': data.emailAddress,
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
                    }) 
                    .then((calendar_res) => 
                        new gauth('emailer', 'gswfp@gswfinancialpartners.com').auth()
                            .then((mail_auth) =>
                                google.gmail({
                                  version: 'v1',
                                  auth: mail_auth
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
                                            code: zoom_res.data.id,
                                        })
                                    }
                                })
                            )
                    )
            ) 
            .then((email) => res.status(200).send({ messages: ['event successfully created']}))
            .catch((err) => {
                console.log(err);
                res.status(400).send({ errors: [err] });
            });
        };
>>>>>>> dfb9741d6619df3047baaef70a740a74367752e1
};

module.exports = {
    post,
    get
};

