var config = require('../config/config');

module.exports = (req, res, next) => {
    console.log(req.ip);
    return (req.ips === `${config.domain}:${config.port}`) ?
        next() :
        res.status(400).send({ errors: ['Inadequate permissions for this endpoint.'] });
};


