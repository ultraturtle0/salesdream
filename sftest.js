var sf = require('./apps/salesforce');

var getIds = () => {
    sf.login()
        .then(() => {
            sf.conn.sobject("Contact")
                .find({})
                .limit(5)
                .execute((err, records) => {
                    console.log(records[0]);
                });
        });
};

var updateTest = (type, id, update) => {
    sf.login()
        .then(() => {
            sf.conn.sobject(type)
                .find({ Id: id})
                .update(update, (err, res) => {
                    if (err) console.log(err);
                    console.log(res[0].errors);
                });
        });
};

var describeIndustries = () => {
    sf.login()
        .then(() => {
            sf.conn.describe("Account", (err, account) => {
                var lists = account.fields.filter(field => (field.label === 'Industries'))
                console.log(lists[0].picklistValues);
            });
        })
};

//describeIndustries();
updateTest("Contact", '0035500000MHeyBAAT', {
    LeadSource: 'Other'
});
//getIds()
