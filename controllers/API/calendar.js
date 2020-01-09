const { google } = require('googleapis');
const zoom_config = require('../../config/config').zoom;
const readline = require('readline');
const fs = require('fs');
const zoomEmail = require('../../config/emails/zoom.js');
const config = require('../../config/config');
const handler = require('../../util/errorHandler');
var moment = require('moment');
var axios = require('axios');
var jwt = require('jsonwebtoken');

const zoom_token = jwt.sign({
        iss: zoom_config.production.APIKey,
        exp: ((new Date()).getTime() + 5000)
    }, zoom_config.production.APISecret);

const gauth = require('../../util/google_token');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    return ({
        get: (req, res, next) =>
            axios.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/calendar`, { params: {...req.params, api_key }})
                .then((cal_res) => res.send(cal_res.data))
                .catch((err) => 
                    handler({
                        custom: 'Error retrieving calendar entries from API: ',
                        err,
                        res
                    })
                ),

        post: (req, res, next) => {
            console.log('Calendar Submitted.');
            if (req.body.laterDate === 'true') {
                return next();
            };
            var errors = [];
            var data = ['FirstName', 'LastName', 'Email']
                .reduce((acc, key) => {
                    acc[key] = req.body[key] || errors.concat('Missing field: ' + key); //res.status(403).send({ errors: ['Missing field: ' + key] });
                    return acc;
                }, {});
            data.startEvent = req.body.startEvent;
            var subject = data.FirstName + " " + data.LastName + " - Introductory Zoom Call";
            // start new Zoom meeting
            axios.post(`https://api.zoom.us/v2/users/${zoom_config.userID}/meetings?access_token=${zoom_token}`, 
                {
                    'topic': subject,
                    'type': 2,
                    'start_time': data.startEvent,
                    'duration': 60
                })
                .then((zoom_res) => {
                    req.body.Zoom_Meeting_ID__c = zoom_res.data.id;
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
                            {
                                'email': data.Email,
                                //'comment': 'would love to see you there can u make it?',
                            }
                        ],
                    };
                    return instance.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/calendar`, { event });
                }) 
                .then((event) => {
                    req.messages = (req.messages || []).concat('event successfully created');
                    next();
                })
                .catch((err) => 
                    handler({ err, res, status: 400 })
                );
        }
    });
};
