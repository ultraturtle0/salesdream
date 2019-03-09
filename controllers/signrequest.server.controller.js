const axios = require('axios');
const config = require('../config/config.js');
const EMAILS = config.emails;
const TOKEN = config.signrequest.token.test_net;
//const EMAILS
var gapi = require('../apps/gmail');

var gmail = gapi.authorize();


var SIGN_CONFIG = require('../config/signrequest'); 
var signed = (req, res, next) => {
        console.log('Document signed.');
        
        // if it's the BACKGROUND CHECK
        //if (req.data.document.external_id === SIGN_CONFIG.IDs['0']) {
            gmail
                .then((auth) => {
                    console.log('WE GET HERE');
                    gapi.send(auth, EMAILS.hello_world({}));
                }); 
                
        //}
        res.sendStatus(200);
            

    }


var events = {
    convert_error: (req, res, next) => {
        console.log('Document convert error');
    },
    converted: (req, res, next) => {
        console.log('Document converted.');
    },
    sending_error: (req, res, next) => {
        console.log('Document sending error');
    },
    signed: signed
    /* ...
     * sent
     * declined
     * cancelled
     * signed
     * signer_signed
     * signer_email_bounced
     * signer_viewed_email
     * signer_viewed
     * signer_forwarded
     * signer_downloaded
     * signrequest_received
     */
}

var event_handler = (req, res, next) => {
    events[req.body.data.event_type](req, res, next);
}


module.exports = { 
    events: event_handler,
    signrequest: (req, res, next) => {
        res.send(200).json({data: 'ok'})
    }
}
