var Salesforce = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

const survey = config.surveymonkey.surveys.newClient;
var newClient_id = survey.id;
var accessToken = config.surveymonkey.accessToken;

module.exports = (req, res, next) => {
    console.log('Client Onboarding form completed');
/*    var response_id = '10344222692'//req.data.object_id;

    // GET INDIVIDUAL RESPONSE
    axios({
        method: 'get',
        url: `https://api.surveymonkey.com/v3/surveys/${newClient_id}/responses/${response_id}/details`,
        params: {
            sort_order: 'DESC'
        },
        headers: {
            'Authorization': 'bearer ' + accessToken
        }
    
    })
    // GET QUESTION ANSWERS
    .then((res) => {
        answers = {};
        res.data.pages.forEach((page) => {
            // RUN SURVEY QUESTION PROCESSING FUNCTION FOR EACH QUESTION ID
            page.questions.forEach(q => {
                var sq = survey.questions[q.id]
                answers[sq.name] = sq.answer(q.answers)
            });
        });
        // SEND "answers" TO SALESFORCE HERE
    })
    /*.then((res) => {
        console.log(res.data.pages[0].questions);
    })
    .catch(err => console.log(err));
*/

    res.status(200).json({data: 'ok'});
    console.log(req.data);
}


