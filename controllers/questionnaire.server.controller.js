var uuid = require('uuid/v4');
var LinkSchema = require('mongoose').model('Link');

var questionnaire = require('./API/questionnaire');

module.exports = {
    get: questionnaire.get,
    post: questionnaire.post
};
