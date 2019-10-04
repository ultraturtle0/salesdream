const db = require('../config/mongoose')();
const User = require('mongoose').model('User');
const readline = require('readline-sync');

const questions = {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email'
};
var config = {};

Object.keys(questions)
    .forEach((key) => config[key] = readline.question(`${questions[key]}: `, {
        hideEchoBack: false
    }));

config.password = readline.question('Password: ', {
    hideEchoBack: true
});

config.password === readline.question('Confirm password: ', {
    hideEchoBack: true
}) ?
    null :
    process.exit();

config.username = (config.firstName.charAt(0) + config.lastName).toLowerCase();

const admin = new User(config);
admin.provider = 'local';
admin.perms = 'POST';

admin.save((err) => {
    if (err) {
        console.error('Error generating admin user.');
        console.error(err);
    } else {
        console.log('Admin user generated.');
    }
});


