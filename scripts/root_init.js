const config = require('../config/config');
const db = require('../config/mongoose')();
const User = require('mongoose').model('User');

const root = new User(config.root);
root.provider = 'local';

root.save((err) => {
    if (err) {
        console.error('Error generating root user.');
        console.error(err);
    } else {
        console.log('Root user generated.');
    }
});


