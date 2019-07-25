var uuid = require('uuid/v4');
var LinkSchema = require('mongoose').model('Link');

var questionnaire = require('./API/questionnaire');

var gen = (req, res, next) => {
    var Link = new LinkSchema({
        salesforce: res.data.id,
        email: res.data.email
    });
    Link.save()
        .then((link) => {
            res.cookie('complete', link.id, {
                expires: new Date(new Date().getTime() + (1000*60*60*24*365*10))
            });
            res.send({ messages: ['success'] });
        })
        .catch((err) => {
            res.send({ errors: ['Error saving questionnaire answers.', err] });
        });
};

module.exports = {
    gen,
    get: questionnaire.get,
    post: questionnaire.post
};
