const api_key = require('../config/config').API.api_key;

module.exports = (req, res, next) => {
    req.query.api_key = api_key;
    next();
};
