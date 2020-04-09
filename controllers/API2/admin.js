var User = require('mongoose').model('User');
var crypto = require('crypto');
var gauth = require('../../util/google_token');
var { google } = require('googleapis');
var userEmail = require('../../config/emails/userEmail');
const handler = require('../../util/errorHandler');

var users = {
    create: (req, res, next) => {
        console.log('create new user. body: ');
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
            .then((user) => {
                console.log('user here');
                console.log(user);
                return new gauth('emailer', 'gswfp@gswfinancialpartners.com')
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
            })
            .then((user) => res.send({ messages: ['user successfully saved, login email sent'] }))
            .catch((err) => {
                console.log('Error saving new user');
                console.log(err);
                return res.status(500).send({ errors: ['Error saving new user.', err] });
            });
    },

    update: (req, res, next) => {
        var update = {};
        if (req.body.$set)
            update.$set = req.body.$set;
        if (req.body.$push)
            update.$push = req.body.$push;
        var query = { _id: req.params._id };
        User.findOneAndUpdate(query, update, { new: true })
            .then((user) => res.status(200).send(user))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            });
    }, 
    
    get: (req, res, next) =>
        User.find(req.params || {})
            .then((users) => res.status(200).send(users))
            .catch((err) => {
                console.log('Error retrieving users.');
                console.log(err);
                return res.status(500).send({ errors: ['Error retrieving users.', err] });
            })
}

module.exports = {
    users
}
