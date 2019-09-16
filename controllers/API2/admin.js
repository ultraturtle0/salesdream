var User = require('mongoose').model('User');
var crypto = require('crypto');
var gauth = require('../../util/google_token');
var { google } = require('googleapis');
var userEmail = require('../../config/emails/userEmail');

var users = {
    create: (req, res, next) => {
        console.log(req.body);
        var { user, ...metadata } = req.body;
        var new_user = new User(user);
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
            .catch((err) => res.status(500).send({ errors: ['error saving user', err] }));
    },
    
    get: (req, res, next) =>
        User.find(req.params || {})
            .then((users) => res.status(200).send(users))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            })
}

module.exports = {
    users
}
