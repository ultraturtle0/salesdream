var sf = require('../../apps/salesforce');
var axios = require('axios');
const config = require('../../config/config');

var accessToken = config.surveymonkey.accessToken;

var get = (req, res, next) => {
    var sfQuery = {};
    var sfOptions = {
        sort: { CreatedDate: -1 }
    };
    sf.login()
        .then(() => /*sf.findObjs(sf.conn, 'Lead', sfQuery, sfOptions)
            .execute((err, leads) => {*/

            sf.conn.sobject("Lead").find({}).execute((err, leads) => {
                console.log('does this execute?');

                var message = err ?
                    'Error connecting to Salesforce database, please try again.'
                    : (leads.length ? '' : 'No new leads, go get some!');
                res.send({ message, leads });
            })
        );
        /*(err) => {
            console.log(err)
                        });
        });*/
};

var post = (req, res, next) => {
    console.log('Basic Client Onboarding completed.');
    var body = req.body;
    var sfbody = {
        FirstName: body.FirstName, 
        LastName: body.LastName,
        Phone: body.Phone,
        Email: body.Email,
        Company: body.Company,
        Description: body.Description
    };
    sf.login()
        .then(() => sf.createObj(sf.conn, 'Lead', sfbody))
        .then(() => res.status(200).json({data: 'ok'}))
        .catch((err) => {
            console.log(err);
            res.status(400).send(err);
        });

};

module.exports = { get, post };
