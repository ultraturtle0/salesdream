var LinkSchema = require('mongoose').model('Link');

var get = (req, res, next) => { 
    delete req.query.api_key;
    var query;
    if (req.params._id) {
        query = { _id: req.params._id };
    } else {
        query = req.query;
    };
    LinkSchema.find(query)
        .then((docs) => {
            console.log(docs);
            return res.status(200).send(docs);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ errors: [err] })
        });
};

var create = (req, res, next) => {
    console.log('creating new link');
    console.log(req.body);
    new LinkSchema(req.body)
        .save()
        .then((link) => {
            console.log(link);
            res.status(200).send(link)
        })
        .catch((err) => res.status(500).send({ errors: [err] }));
    
};

var update = (req, res, next) => {
    var update = {
        $set: req.body.$set || {},
        $push: req.body.$push || {}
    };
    var search = req.body.search || '_id';
    LinkSchema.findOneAndUpdate({ [search]: req.params[search] }, update, { new: true })
        .then((link) => {
            console.log(link);
            return res.status(200).send(link)
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({ errors: [err] });
        });
};


module.exports = {
    get,
    create,
    update
};
