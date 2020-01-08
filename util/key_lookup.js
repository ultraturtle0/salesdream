const axios = require('axios');
const config = require('../config/config');
var Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

module.exports = (scopes) =>
    fs.readFileAsync(path.resolve(__dirname, '../config/env/keys/perm_key'), 'utf-8')
        .catch((err) => {
            console.log(err);
            return axios.post(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/keygen`, { scopes })
                .then((res) => {
                    if (res.data.key) {
                        return fs.writeFileAsync(path.resolve(__dirname, '../config/env/keys/perm_key'), res.data.key, {})
                            .then(() => Promise.resolve(res.data.key));
                    };
                    return Promise.reject('Key not found.');
                })
                .catch((err) => Promise.reject(err));
        })
    
