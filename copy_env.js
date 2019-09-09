const scp = require('./util/scp.js');
const config = require('./config/sysadmin');
const fs = require('fs');
const path = require('path');

const file = 'config/env/deployment.js';
const env_path = path.join(path.dirname(fs.realpathSync(__filename)), file);
console.log(env_path);

scp({
    filename: env_path,
    host: config.host,
    username: config.username,
    password: config.password,
    path: path.join(config.path, file)
});

