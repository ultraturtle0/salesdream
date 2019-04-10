const config = require('./config/config');
const db = require('./config/mongoose')();
const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');

const zapier = new User(config.zapier);
zapier.provider = 'local';

const tempkey = uuid();
zapier.tempkey = tempkey;

const payload = {
    sub: zapier.username,
    perms: zapier.perms,
    iss: config.passport.issuer,
    tempkey: tempkey
};

const token = jwt.sign(payload, config.passport.secret);

zapier.save((err) => {
    if (err) {
        console.error('Error generating zapier user.');
        console.error(err);
    } else {
        console.log(`Zapier user generated. Token: ${token}`);
    }
});


