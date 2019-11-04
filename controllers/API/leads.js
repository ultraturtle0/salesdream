const axios = require('axios');
const config = require('../../config/config');

// get leads from backend API
var get = (req, res, next) =>
    axios.get(`${config.API.protocol}${config.API.domain}:${config.API.port}/api/sf/Lead`)
        .then((response) => res.status(200).send(response.data))
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: ['Error retrieving Salesforce leads, please refresh and try again.', err] })
        });

module.exports = {
    get,
};
