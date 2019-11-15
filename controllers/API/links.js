const axios = require('axios');
const config = require('../../config/config');

// get links from backend API
var get = (req, res, next) => {
    var id = req.body._id || '';
    axios.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/link/${id}`)
        .then((leads) => {
            return res.status(200).send(leads.data)
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: ['Error retrieving Lead links, please refresh and try again.', err] })
        });
};

module.exports = {
    get,
};
