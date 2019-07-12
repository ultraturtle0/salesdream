const config = require('../../config/config');
const LinkSchema = require('mongoose').model('Link');
const uuid = require('uuid/v4');

var accessToken = config.surveymonkey.accessToken;

const { google } = require('googleapis');

var get = (req, res, next) => 
    Link.findById(req.params.id, '-link -salesforce')
        .then((link) => 
            link ?  
                res.render('questionnaire', { link }) :
                res.status(404).send({ error: 'survey not found' })
        )
        .catch((err) => {
            console.log(err);
            return res.status(400).send({ error: err });
        });

var post = (req, res, next) => {
    Link.findByIdAndUpdate(req.body._id, 
        {
            $set: {
            
            }
        }
    )
    .then((link) => {
        res.cookie('complete', link.id, {
            expires: new Date(new Date().getTime() + (1000*60*60*24*365*10))
        });
        res.render('thankyou');
    })
    .catch((err) => {
        res.send({ errors: ['Error saving questionnaire answers.', err] });
    });
};


module.exports = {
    get,
    post
};
