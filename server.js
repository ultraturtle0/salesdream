const config = require('./config/config');

const configExpress = require('./config/express');
const configMongoose = require('./config/mongoose');
const configPassport = require('./config/passport');

const app = configExpress();
const db = configMongoose();
const passport = configPassport();

require('./routes/surveys.server.routes.js')(app);
require('./routes/forms.server.routes.js')(app);
require('./routes/general.server.routes.js')(app);
require('./routes/emails.server.routes.js')(app);

require('./routes/questionnaire.server.routes.js')(app);

require('./routes/toolkit.server.routes.js')(app);

require('./routes/admin.server.routes.js')(app);
require('./routes/api.server.routes.js')(app);

app.listen(config.port);
module.exports = app;

console.log('Server running at http://'+ config.domain + ':' + config.port + '/');


