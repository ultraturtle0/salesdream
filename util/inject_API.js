module.exports = (app) => 
    (req, res, next) => {
        req.body.api_key = app.get('api_key');
        next();
    };

