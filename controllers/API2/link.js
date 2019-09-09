var LinkSchema = require('mongoose').model('Link');

// RETURN MORE THAN QUESTIONNAIRE LATER
var get = (req, res, next) => { 
    LinkSchema.findOne({ link: req.params._id })
        .then((link) => res.status(200).send(link.questionnaire))
        .catch((err) => res.status(500).send({ errors: [err] }));
};

var create = (req, res, next) => {
    console.log('creating new link');
    console.log(req.body);
    new LinkSchema(req.body)
        .save()
        .then((link) => res.status(200).send(link))
        .catch((err) => res.status(500).send({ errors: [err] }));
};

var update = (req, res, next) => {
    LinkSchema.updateOne({ _id: id }, { $set: req.data })
        .then((link) => res.status(200).send(link))
        .catch((err) => res.status(500).send({ errors: [err] }));
};


module.exports = {
    get,
    create,
    update
};
