var axios = require('axios');
const config = require('./config/config');
var accessToken = config.surveymonkey.accessToken;
var survey_id = config.surveymonkey.surveys[0];


axios({
    method: 'get',
    url: `https://api.surveymonkey.com/v3/surveys/${survey_id}/responses`,
    headers: {
        'Authorization': 'bearer ' + accessToken
    }
})
.then((res) => {
    var responses = [];
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
.then(res => console.log(res.data.pages[0].questions));

