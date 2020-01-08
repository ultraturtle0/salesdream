const axios = require('axios');
const config = require('../../config/config');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    return ({
        // get picklists from backend API
        get: (req, res, next) =>
            instance.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/sf/picklists`)
                .then((response) => res.status(200).send(response.data))
                .catch((err) =>
                    handler({
                        custom: 'Error retrieving Salesforce leads, please refresh and try again.', 
                        err,
                        res
                    })
                )
    });
};


