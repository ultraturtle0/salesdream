var sf = require('../../apps/salesforce');
const handler = require('../../util/errorHandler');

PL = {
    Lead: ['Lead Source'],
    Account: ['Industry', 'Software', 'Business Classification']
};

var partners = {
    get: (req, res, next) => 
        sf.login()
            .then((conn) => sf.findObjs(sf.conn, 'Contact', {query: { RecordTypeId: '01255000000YCfHAAW'}}))
            .then((partners) => res.send({ partners }))
            .catch((err) => handler({
                custom: 'Error retrieving tax preparers.',
                err,
                res
            })),
};

var picklists = {
    get: (req, res, next) =>
        sf.login()
            .then(() => sf.picklists(PL))
            .then((picklists) => {
                console.log(picklists);
                return res.send({ picklists })
            })
            .catch((err) => 
                handler({
                    custom: 'Error retrieving picklist values.',
                    err,
                    res
                })
            ),
}

var Lead = {
    get: (req, res, next) => {
        delete req.query.api_key;
        console.log(req.query);
        return sf.login()
            .then(() => sf.findObjs(sf.conn, 'Lead', { query: req.query }))
            .then((lead) => res.send(lead))
            .catch((err) => {
                console.log(err);
                res.status(500).send({ errors: [err] });
            })
    },
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
    picklists,
    partners
};
