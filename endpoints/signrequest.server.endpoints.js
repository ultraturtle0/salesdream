const signrequest = require('../controllers/signrequest.server.controller');

const routes = ['signrequest', 'events'];

module.exports = (app) => {
    routes.forEach(route =>
        app.route('/' + route)
            //.get(signrequest.webhook_approval)
            .post(signrequest[route])
    );
}
