var { ledger } = require('./API/toolkit');

module.exports = {
    post: ledger.post,
    get: ledger.get
}
