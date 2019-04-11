var sf = require('./apps/salesforce');

sf.login()
    .then(sf.conn.sobject("Account").find({ Id: '0015500000OfVUYAA3' })
        .update({ Industries__c: 'Other' }, function (err, rets) {
            console.log(err);
            console.log(rets[0].errors);
            console.log(rets[0]);
        })
    );
