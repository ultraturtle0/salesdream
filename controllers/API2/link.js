var LinkSchema = require('mongoose').model('Link');

var get = (req, res, next) => { 
    var query = req.params.id ?
        { _id: req.params.id } :
        {};
    LinkSchema.find(query)
        .then((docs) => {
            var links = (docs.length === 1) ?
                docs[0] : docs;
            console.log(links);
            return res.status(200).send(links)
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
    console.log(update);
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
