const Link = require('mongoose').model('Link');

module.exports = (tool) =>
    ((req, res, next) => {
        Link.findOne({ [tool]: req.params.link })
            //.select(`${tool} companyName -_id`)
            .exec()
            .then((doc) => {
                if (doc) {
                    req.body = {
                        ...(req.body || {}),
                        [tool]: doc[tool],
                        companyName: doc.companyName
                    }
                    next();
                } else {
                    return res.status(404).send();
                };
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).send();
            });
    });


