const config = require('./config');
const mongoose = require('mongoose');
const querystring = require('querystring');
mongoose.Promise = require('bluebird');

module.exports = () => {
    const connectionStr = `mongodb://${config.mongoose.username}:${querystring.escape(config.mongoose.password)}@${config.mongoose.host}:27017/${config.mongoose.db}`;
    const db = mongoose.connect(connectionStr, { useNewUrlParser: true });
    require('../models/user.js');
    require('../models/link.js');
    return db;
};

