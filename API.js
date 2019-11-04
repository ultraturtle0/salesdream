const config = require('./config/config').API;
const cors = require('cors');

const configExpress = require('./config/express');
const configMongoose = require('./config/mongoose');
const configPassport = require('./config/passport');

const app = configExpress();
const db = configMongoose();
const passport = configPassport();

app.use(cors({ options: `http://${config.hostname}:${config.port}` }));

require('./endpoints/salesforce.API.endpoints.js')(app);
require('./endpoints/linkgen.API.endpoints.js')(app);
require('./endpoints/toolkit.API.endpoints.js')(app);
require('./endpoints/calendar.API.endpoints.js')(app);
require('./endpoints/admin.API.endpoints.js')(app);
app.listen(config.port);
module.exports = app;

console.log('API running at http://'+ config.domain + ':' + config.port + '/');


