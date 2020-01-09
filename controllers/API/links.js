const axios = require('axios');
const config = require('../../config/config');
const handler = require('../../util/errorHandler');

module.exports = (api_key) => {
    var instance = axios.create({
        params: { api_key }
    });
 
    return ({
        // get links from backend API
        get: (req, res, next) => {
            var id = req.body._id || req.params._id || '';
            console.log('DO WE GET THIS FAR');
            console.log(id);
            instance.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/link/${id}`, req.query)
                .then((leads) => {
                    return res.status(200).send(leads.data)
                })
                .catch((err) => 
                    handler({
                        custom: 'Error retrieving Lead links, please refresh and try again.',
                        err,
                        res
                    })
                );
        }
    });
};
