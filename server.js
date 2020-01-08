const config = require('./config/config');
const axios = require('axios');

const configExpress = require('./config/express');
const configMongoose = require('./config/mongoose');
const configPassport = require('./config/passport');

const app = configExpress();
const db = configMongoose();
const passport = configPassport();
const keys = require('./util/key_lookup');



module.exports = app;

// Request API credentials
// Give permissions for different API endpoints
const SCOPES = ['admin', 'users', 'core', 'calendar', 'emails', 'links', 'sf', 'toolkit', 'contracts'];
keys(SCOPES)
    .then((api_key) => {

        app.set('api_key', api_key);

        require('./routes/surveys.server.routes.js')(app);
        require('./routes/forms.server.routes.js')(app);
        require('./routes/general.server.routes.js')(app);
        require('./routes/emails.server.routes.js')(app);

        require('./routes/questionnaire.server.routes.js')(app);

        require('./routes/toolkit.server.routes.js')(app);

        require('./routes/admin.server.routes.js')(app);
        require('./routes/api.server.routes.js')(app);

        axios.post('http://localhost:9601/api/verify', { api_key })
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err));
        app.listen(config.port);
        console.log('Server running at http://'+ config.domain + ':' + config.port + '/');
        console.log(app.get('api_key'));
    });


