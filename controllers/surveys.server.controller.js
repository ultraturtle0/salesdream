var QBO = require('./API/QBO');
var newHire = require('./API/newHire');
var newClient = require('./API/newClient');

module.exports = {

    QBO: QBO, 

    newHire: newHire, 

    newClient: newClient,

    webhook_approval: (req, res, next) => {
        res.status(200).json({data: 'ok'});
    },

/*    QBOtest: (req, res, next) => {
        res.render('QBOtest', {});
    }
    */
}
