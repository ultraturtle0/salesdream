const config = require('../config/config');
const db = require('../config/mongoose')();
const User = require('mongoose').model('User');

const zapier = new User(config.zapier);
zapier.provider = 'local';

zapier.save((err) => {
    if (err) {
        console.error('Error generating zapier user.');
        console.error(err);
    } else {
        console.log('Zapier user generated.');
    }
});


