const axios = require('axios');
const config = require('../../config/config');
const handler = require('../../util/errorHandler');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });

    return ({
        // get salesforce partners from backend API
        get: (req, res, next) =>
            instance.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/sf/partners`)
                .then((response) => res.status(200).send(response.data))
                .catch((err) =>
                    handler({
                        custom: 'Error retrieving Salesforce partners, please refresh and try again.', 
                        err,
                        res
                    })
                )
    });
};

