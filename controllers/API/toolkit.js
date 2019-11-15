var sf = require('../../apps/salesforce');
var uuid = require('uuid/v4')
var axios = require('axios');
var Promise = require('bluebird');
const config = require('../../config/config');

const { google } = require('googleapis');
// load token by Promise
const gauth = require('../../util/google_token');
const gfile = require('../../util/filegen');
const LinkSchema = require('mongoose').model('Link');

var questionnaire_get = (req, res, next) => {
    console.log(req.params)
    LinkSchema.findOne({ link: req.query.link })
        .select('firstName lastName companyName questionnaire')
        .exec()
        .then((doc) => {
            console.log(doc);
            res.send(doc);
        });
};

var questionnaire_post = (req, res, next) => {
    console.log(req.body);
    var { internal, link, ...body } = req.body;
    var update = {
        $set: {
            questionnaire: body,
            Email: body.Email
        },
        $push: {
            completed: Date.now()
        },
        search: 'link'
    };

    axios.put(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/link/${link}`, update)
        .then((link) => {
            res.redirect(`${config.protocol}//${config.domain}:${config.port}/thankyou`);
        })
        .catch((err) => {
            console.log(err);
            res.send({ errors: ['Error saving questionnaire answers.', err] });
        });
};


var ledger_get = (req, res, next) => 
    axios.get(`${config.API.protocol}//${config.API.domain}:${config.API.port}/api/sf/Account`,
        { params: { fields: "Id, Name" } }
    )
        .then((response) => {
            /*if (res.data.errors) {
                console.log(res.data.errors);
                res.status(500).send({ errors: [res.data.errors] });
            };
            */
            console.log(response.data);
            res.status(200).send({ accounts: response.data });
        })
        .catch((err) => {
            console.log('THIS FAILS');
            console.log(err);
            res.status(500).send({ errors: [err] });;
        });

var ledger_gen = (req, res, next) => {
    var link = uuid();
    console.log(req.body);
    axios.put(`${config.API.protocol}${config.API.domain}:${config.API.port}/api/link/${req.body._id}`, { $set: { ledgerLink: link }, $push: { l_sent: Date(Date.now()) }})
        .then((update) => {
            console.log(link);
            res.status(200).send({ ledgerLink: link });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({});
        });
}

var ledger_post = (req, res, next) => {
    console.log("Ledger generation requested.");
    var { cardInfo, bankInfo, otherInfo } = req.body;
    var id = req.params.link;
    console.log(req.body);
    // if not 'id' return error

    // set column headers
    var ledger_sheet = [['Account Name', 'Account Type', 'Bank Name', 'Statement Cycle', 'Last Reconciliation Date']];

    if (cardInfo) {
        cardInfo.forEach((cat) => 
            ledger_sheet.push(['CardName', 'CardType', 'CardBank', 'CardStatementCycle', 'CardLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);
    };

    if (bankInfo) {
        bankInfo.forEach((cat) => 
            ledger_sheet.push(['BankName', 'BankType', 'Bank', 'BankStatementCycle', 'BankLastReconciled'].map((field) => cat[field])));
        ledger_sheet.push(['','','','','']);
    };


    if (otherInfo) {
        otherInfo.forEach((cat) => 
            ledger_sheet.push(['OtherName', 'OtherType', '', 'OtherStatementCycle', 'OtherLastReconciled'].map((field) => cat[field] || '')));
        ledger_sheet.push(['','','','','']);
    };

    
    LinkSchema.findOneAndUpdate({ ledgerLink: id }, {
        ledger: { cardInfo, bankInfo, otherInfo }
    }, { new: true })
    .then((link) => {
        // access Google APIs on behalf of gswfp
        console.log(link);
        new gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
            .auth()
            .then((auth) => {
                const sheets = google.sheets({version: 'v4', auth });
                const drive = google.drive({version: 'v3', auth });
                var cb = new Promise((resolve, reject) => resolve(link.clientFiles));
                
                // make Client Files directory if it doesn't exist
                if (!link.clientFiles) {
                    cb = gfile.mkdir({ 
                        auth,
                        name: link.companyName + ' Files',
                        parents: [config.g_drive.folders.client_files]
                    })
                    .then((response) => 
                        LinkSchema.updateOne({ ledgerLink: id }, { clientFiles: response.data.id })
                            .then((doc) => new Promise((resolve, reject) => resolve(response.data.id)))
                    )
                }
                // check if spreadsheet already exists
                return cb.then((clientFiles) =>
                    gfile.mksheet({
                        auth,
                        name: link.companyName + ' Account Ledger',
                        parents: [clientFiles],
                        range: `Sheet1!1:${ledger_sheet.length}`,
                        values: ledger_sheet
                    })
                /*    gfile.ls({ auth, id: clientFiles })
                        .then((files) =>
                            // MAKE BETTER LATER
                            // create and move new spreadsheet if it exists,
                            // otherwise pass on the spreadsheet id
                            (!files.length) ?
                                sheets.spreadsheets.create({
                                    resource: {
                                        properties: {
                                            title: link.companyName + ' Account Ledger' 
                                        }
                                    },
                                    fields: 'spreadsheetId'
                                })
                                .then((sheet) => 
                                    drive.files.get({
                                        fileId: sheet.data.spreadsheetId,
                                        fields: 'id, parents'
                                    })
                                    .then((file) =>
                                        drive.files.update({
                                            fileId: file.data.id,
                                            addParents: clientFiles,
                                            removeParents: file.data.parents.join(','),
                                            fields: 'id'
                                        })
                                    )
                                ) : (resolve, reject) => resolve({
                                        data: {
                                            spreadsheetId: files[0].id
                                        }
                                    })
                        )
                        .then((response) => 
                            // update cells in sheet
                            sheets.spreadsheets.values.update({
                                spreadsheetId: response.data.spreadsheetId,
                                range: `Sheet1!1:${ledger_sheet.length}`,
                                valueInputOption: 'USER_ENTERED',
                                resource: {
                                    values: ledger_sheet
                                }
                            })
                        )
                        */
                );
            })
    })
    .then((file) => res.send({ messages: 'received' }))
    .catch((err) => {
        console.log(err);
        return res.send({ messages: 'received' });
    });
};

module.exports = {
    ledger: {
        get: ledger_get,
        post: ledger_post,
        gen: ledger_gen
    },
    questionnaire: {
        get: questionnaire_get,
        post: questionnaire_post
    }
};
