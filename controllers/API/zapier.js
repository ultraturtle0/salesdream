var axios = require('axios');
const config = require('../../config/config');


/* When we receive a Zapier post request, we need to do the following:
 *
 * 1. tell Zapier everything's OK.
 * 2. determine which type of document needs to be created
 * 3. build headers, format information, and send to SignRequest
 * 4. wait for response and act appropriately
 * (5. send an alert to redo the submission if we get an error back!)
 */

var post = (req, res, next) => {

    
};



module.exports = {
    post: post
};
