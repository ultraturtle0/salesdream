const config = require('../config');

module.exports = (req, res, next) => {
    var key = req.query.api_key || req.body.api_key;
    if (!key) {
        console.log('no api key');
        return res.status(500).send({ errors: ['Missing api key.'] });
    };
    if (key !== config.API.api_key) {
        console.log('wrong API key');
        return res.status(500).send({ errors: ['Invalid api key.'] });
    };
    console.log('Authentication successful.');
    next();
};
    
