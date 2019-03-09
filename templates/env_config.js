const crypto = require('crypto');

emails = require('./emails/index');
surveys = require('./surveys/index');

module.exports = {
    salesforce: {
        username: '',
        password: '',
        token: ''
    },
    surveymonkey: {
        accessToken: ''
    },
    /*zapier: {
        auth_hash: 
        */
    signrequest: {
        token: '', // test_net or main_net
        email: '',
        templates: {
            w9: {
                url: ''
            },
            bg_check: {
                url: ''
            }
        }
    },
    gmail: {
        "installed": {
            "client_id":"",
            "project_id":"",
            "auth_uri":"",
            "token_uri":"",
            "auth_provider_x509_cert_url":"",
            "client_secret":"",
            "redirect_uris": [
                "",
                ""
            ]
        }
    },
    emails: emails,
    port: 9600
}
