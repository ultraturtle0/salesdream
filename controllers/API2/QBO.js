var Salesforce = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var test_id = config.surveymonkey.surveys[1];
var accessToken = config.surveymonkey.accessToken;


module.exports = (req, res, next) => {
        console.log('QBO test completed');
        axios({
            method: 'get',
            url: `https://api.surveymonkey.com/v3/surveys/${test_id}/responses`,
            params: {
                sort_order: 'DESC'
            },
            headers: {
                'Authorization': 'bearer ' + accessToken
            }
        })
        .then(surveys => (
            axios({
                method: 'get',
                url: surveys.data.data[0].href + '/details',
                headers: {
                    'Authorization': 'bearer ' + accessToken
                }
            })
            .catch(err => console.log(err))
        ))
        .then(survey => {
            var name = survey.data.pages[0].questions[0].answers[0].text;
            var score = survey.data.quiz_results.score / survey.data.quiz_results.total_score * 100;
            console.log({name: name, score: score});
            Salesforce.login()
                .then(() => Salesforce.conn.search(`FIND {${name}}`))// IN Name Fields RETURNING Skills__c`))
                .then((skill) => {
                    console.log(skill.searchRecords[0].attributes);
                    return Salesforce.conn.sobject("Skills__c").update({
                        Id : skill.searchRecords[0].Id,
                        QBO_Test_Score__c: score
                    })
                })
                .catch((err) => console.log(err));
        });
/*                        FirstName: 'jjrdyn',
                        LastName: 'ksylle',
                        Email: 'qwerty@nomics.biz',
                        Phone: '1111111111'
                        //LeadSource: 'craigslist'
                    }
                ))
                .then(() => console.log('done'));
                */
                
        res.status(200).json({data: 'ok'});
    }
