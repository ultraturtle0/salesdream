var User = require('mongoose').model('User');
var crypto = require('crypto');
var gauth = require('../../util/google_token');
var { google } = require('googleapis');
var userEmail = require('../../config/emails/userEmail');
var ledgerEmail = require('../../config/emails/ledger');
var axios = require('axios');
const handler = require('../../util/errorHandler');
const templates = require('../../config/emails/templates');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    return ({
        get: (req, res, next) => {
            if (req.params.template && req.params.template in templates) {
                var email = templates[req.params.template];
                return res.send({ email });
            } else {
                return handler({
                    custom: 'Template not found',
                    res
                });
            };
        },
                
        post: (req, res, next) => {
            console.log(req.body);
            var new_user = new User(req.body);
            new_user.provider = 'local';
            var pwd = crypto
                .randomBytes(Math.ceil(12))
                .toString('hex')
                .slice(0, 12);
            new_user.password = pwd;
            new_user.save()
                .then((user) => 
                    new gauth('emailer', 'gswfp@gswfinancialpartners.com')
                        .auth()
                        .then((auth) => 
                            google.gmail({
                                version: 'v1',
                                auth
                            })
                            .users.messages.send({
                                userId: 'me',
                                requestBody: {
                                    raw: userEmail({ user, pwd })
                                }
                            })
                        )
                )
                .then((user) => res.send({ messages: ['user successfully saved, login email sent'] }))
                .catch((err) =>
                    handler({
                        custom: 'Error saving user',
                        err,
                        res
                    })
                );
        },
        ledger: (req, res, next) => {
            new gauth('emailer', 'gswfp@gswfinancialpartners.com')
                .auth()
                .then((auth) => 
                    google.gmail({
                        version: 'v1',
                        auth
                    })
                    .users.messages.send({
                        userId: 'me',
                        requestBody: {
                            raw: ledgerEmail(req.body)
                        }
                    })
                )
                .then((google_res) => {
                    console.log(google_res);
                    res.send(res.data);
                });
        }
    });
};

