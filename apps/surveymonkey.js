var config = require('../config/config');

var SurveyMonkeyAPI = require('surveymonkey').SurveyMonkeyAPI;

var axios = require('axios');

var accessToken = config.surveymonkey.accessToken;

var survey_id = config.surveymonkey.surveys[0];

/*try {
var api = new SurveyMonkeyAPI(accessToken, {
    version: 'v3',
    secure: false
});
} catch (error) {
    console.log(error.message);
}

api.getSurveyList({}, (error, data) => {
    if (error) console.log(error.message)
    else console.log(JSON.stringify(data));
});*/

var responses = [];

axios({
    method: 'get',
    url: `https://api.surveymonkey.com/v3/surveys/${survey_id}/responses`,
    headers: {
        'Authorization': 'bearer ' + accessToken
    }
})
.then((res) => {
    res.data.data.forEach(response => responses.push(response));
    return responses[res.data.data.length-3];
})
.then((res) => axios({
    method: 'get',
    url: res.href + '/details',
    headers: {
        'Authorization': 'bearer ' + accessToken
    }
}))
.then(res => {
    res.data.pages[0].questions.forEach((question, index) => {
    console.log('QUESTION ' + index);
    question.answers.forEach(answer => console.log(answer));
    })
})
.catch(err => console.error(err));


