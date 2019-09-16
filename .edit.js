const db = require('./config/mongoose')();
const User = require('mongoose').model('User');

User.updateOne({ username: 'root' }, { $set: { perms: ['GET', 'POST', 'ADMIN'] }})
    .then((root) => console.log(root))
    .catch(err => console.log(err));
