const axios = require('axios');
const config = require('../../config/config');

// get links from backend API
var get = (req, res, next) =>
    axios.get(`${config.API.protocol}${config.API.domain}:${config.API.port}/api/link/${req.body._id}`)
        .then((leads) => {
            console.log(leads.data);
            return res.status(200).send(leads.data)
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: ['Error retrieving Lead links, please refresh and try again.', err] })
        });

module.exports = {
    get,
};
