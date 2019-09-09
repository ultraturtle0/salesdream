var client = require('scp2');

module.exports = (options) =>
    client.scp(options.filename, {
        host: options.host,
        username: options.username,
        password: options.password,
        path: options.path
    }, err => console.log(err));
