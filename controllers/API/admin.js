var User = require('mongoose').model('User');
var crypto = require('crypto');
var gauth = require('../../util/google_token');
var { google } = require('googleapis');
var userEmail = require('../../config/emails/userEmail');
const config = require('../../config/config');
var axios = require('axios');
const handler = require('../../util/errorHandler');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    var get = (req, res, next) =>
        instance.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/users`)
            .then((response) => res.status(200).send(response.data))
            .catch((err) =>
                handler({
                    custom: 'Error retrieving users, please refresh and try again',
                    err,
                    res
                })
            );

    var updatePerms = (req, res, next) =>
        instance.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/users/${req.params._id}`, { $set: { perms: req.body.perms }})
            .then((response) => res.status(200).send({ messages: ['Successfully updated.'] }))
            .catch((err) =>
                handler({
                    custom: 'Error updating user permissions, please refresh and try again',
                    err, res
                })
            );
 

    var post = (req, res, next) => {
        console.log('DOES THIS REGISTER?');
        console.log(req.body);
        return instance.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/users`, req.body)
            .then((response) => res.status(200).send(response.data))
            .catch((err) => handler({
                    custom: 'Error adding user, please refresh and try again',
                    err,
                    res
                })
            )
    };

    return ({
        get,
        updatePerms,
        post
    });
}







