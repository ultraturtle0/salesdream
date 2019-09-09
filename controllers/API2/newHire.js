var Salesforce = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');
//var configHire = require('../../config/configHire');

var newHire_id = config.surveymonkey.surveys[0];
var accessToken = config.surveymonkey.accessToken;




var POST = (req, res, next) => {
    console.log('Hiring Questionnaire completed');
    axios({
        method: 'get',
        url: `https://api.surveymonkey.com/v3/surveys/${newHire_id}/responses`,
        params: {
            sort_order: 'DESC'
        },
        headers: {
            'Authorization': 'bearer ' + accessToken
        }
    })
    .then((res) => (
        axios({
            method: 'get',
            url: res.data.data[0].href + '/details',
            headers: {
                'Authorization': 'bearer ' + accessToken
            }
        })
    ))
    .then((res) => {

        var questions = [];
        //res.data.pages[0].questions.forEach(question => questions.push(configHire(question)));
        //console.log(questions);
        res.data.pages[0].questions.forEach(q => console.log(q.id));
        // ADD SALESFORCE INTEGRATION HERE
    })
    .catch(err => console.log(err));

    res.status(200).json({data: 'ok'});

}

var GET = (req, res, next) => {
    axios({
        method: 'get',
        url: `https://api.surveymonkey.com/v3/surveys/${newHire_id}/responses/bulk`,
        params: {
            sort_order: 'DESC'
        },
        headers: {
            'Authorization': 'bearer ' + accessToken
        }
    })
    .then((res) => {
        res.status(200).json(res.data)
    });
}

/*module.exports = {
    POST: POST,
    GET: GET
}*/

module.exports = POST;
