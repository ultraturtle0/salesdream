var LinkSchema = require('mongoose').model('Link');

var get = (req, res, next) => { 
    LinkSchema.findOne({ _id: req.params.id })
        .then((link) => {
            console.log(link);
            return res.status(200).send(link)
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
    console.log(update);
    LinkSchema.findOneAndUpdate({ _id: req.params.id }, update, { new: true })
        .then((link) => {
            console.log(link);
            return res.status(200).send(link)
        })
        .catch((err) => res.status(500).send({ errors: [err] }));
};


module.exports = {
    get,
    create,
    update
};
