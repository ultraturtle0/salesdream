const config = require('./config/config');

const configExpress = require('./config/express');
const configMongoose = require('./config/mongoose');
const configPassport = require('./config/passport');

const app = configExpress();
const db = configMongoose();
const passport = configPassport();

require('./endpoints/surveys.server.endpoints.js')(app);
require('./endpoints/signrequest.server.endpoints.js')(app);
require('./endpoints/forms.server.endpoints.js')(app);
require('./endpoints/general.server.endpoints.js')(app);

require('./endpoints/zapier.server.endpoints.js')(app);

require('./endpoints/questionnaire.server.endpoints.js')(app);

require('./endpoints/scheduling.server.endpoints.js')(app);

require('./endpoints/toolkit.server.endpoints.js')(app);

require('./endpoints/linkgen.server.endpoints.js')(app);
app.listen(config.port);
module.exports = app;

console.log('Server running at http://'+ config.domain + ':' + config.port + '/');


