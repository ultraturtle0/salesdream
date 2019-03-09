var config = require('./config/config');
var Salesforce = require('./apps/salesforce');
//var SurveyMonkey = require('./apps/surveymonkey');
var axios = require('axios');
var accessToken = config.surveymonkey.accessToken;
var survey_id = config.surveymonkey.surveys[0];
var test_id = config.surveymonkey.surveys[1];


/*Salesforce.login()
    .then(() => Salesforce.createObj(Salesforce.conn, "Contact", 
        {
            FirstName: 'jjrdyn',
            LastName: 'ksylle',
            Email: 'qwerty@nomics.biz',
            Phone: '1111111111'
            //LeadSource: 'craigslist'
        }
    )
        .then(() => console.log('done'))
    );
*/

axios({
    method: 'get',
    url: `https://api.surveymonkey.com/v3/surveys/${test_id}/responses`,
    headers: {
        'Authorization': 'bearer ' + accessToken
    }
})
.then((res) => {
    var responses = [];
    res.data.data.forEach(response => responses.push(response));
    return responses[0];
    //return responses[res.data.data.length-3];
})
.then((res) => axios({
    method: 'get',
    url: res.href + '/details',
    headers: {
        'Authorization': 'bearer ' + accessToken
    }
}))
.then(res => {
    var results = res.data.quiz_results;
    var score = results.score / results.total_questions;
    //var questions = res.data.pages[0].questions.map(q => q.answers);
    console.log(score);
    /*
    console.log(questions[0]);
    var Name = questions[0][0].text.split(' ');

    // NEED TO ADD RECORD TYPE: CONTRACTOR
    var newContact = {
        FirstName: Name[0],
        LastName: Name[1],
        Email: questions[1][0].text,
        Phone: questions[2][0].text
    }

    Salesforce.login()
        .then(() => Salesforce.createObj(Salesforce.conn, "Contact", newContact));
    */
})
.catch(err => console.error(err));


