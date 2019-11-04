var sf = require('../../apps/salesforce');
sf.login();

PL = {
    Lead: ['Lead Source', 'Tax Preparer'],
    Account: ['Industry', 'Software', 'Business Classification']
};

var picklists = {
    get: (req, res, next) => {
        sf.login()
            .then(() => sf.picklists(PL))
            .then((picklists) => res.send({ picklists }))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: ['Error retrieving picklist values.', err] });
            });
    },
}

var Lead = {
    get: (req, res, next) =>
        sf.findObjs(sf.conn, 'Lead', req.query)
            .then((lead) => res.send(lead))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            }),
    create: (req, res, next) =>
        sf.createObj(sf.conn, 'Lead', req.body)
            .then((lead) => res.send(lead))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            })
};

var Account = {
    get: (req, res, next) => {
        console.log(req.params);
        return sf.findObjs(sf.conn, 'Account', req.query)
            .then((acc) => res.send(acc))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            });
    },
    create: (req, res, next) => res.status(404).send()
}


module.exports = {
    Lead,
    Account,
    picklists
};
