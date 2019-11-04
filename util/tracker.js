// Middleware that adds dates and times that a client opens/completes sent forms
//
const LinkSchema = require('mongoose').model('Link');

const forms = {
    questionnaire: 'link',
    ledger: 'ledgerLink'
};

const opens = {
    questionnaire: 'q_opened',
    ledger: 'l_opened'
};

const sends = {
    questionnaire: 'q_completed',
    ledger: 'l_completed'
};

var open = (form) =>
    (req, res, next) => {
        var form_link = forms[form];
        var form_opened = opens[form];
        LinkSchema.updateOne({ [form_link]: req.params.link },
            { $push: { [form_opened]: Date.now() }}
        )
        .catch((err) => {
            console.log(err);
            next()
        })
        .finally(next);
    };

var complete = (form) =>
    (req, res, next) => {
        var form_link = forms[form];
        var form_completed = sends[form];
        LinkSchema.updateOne({ [form_link]: req.params.link },
            { $push: { [form_completed]: Date.now() }}
        )
        .catch((err) => {
            console.log(err);
            next()
        })
        .finally(next);
    };

module.exports = {
    open,
    complete
};

