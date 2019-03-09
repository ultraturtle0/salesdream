const config = require('./config/config');

var axios = require('axios');
var accessToken = config.surveymonkey.accessToken;
var survey_id = config.surveymonkey.surveys[0];
var test_id = config.surveymonkey.surveys[1];

// CREATE QBO TEST WEBHOOK
axios({
    method: 'post',
    url: `https://api.surveymonkey.com/v3/webhooks`,
    headers: {
        'Authorization': 'bearer ' + accessToken
    },
    data: {
        name: "QBO Test",
        event_type: "response_completed",
        object_type: "survey",
        object_ids: [test_id],
        subscription_url: "http://138.197.20.29:9600/QBO"
    }
})
.then(res => console.log(res.data))
.catch(err => console.log(err.response));
