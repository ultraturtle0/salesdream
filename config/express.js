const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

module.exports = () => {
    const app = express();
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());
    app.use(cookie());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'hunkydory' //config.sessionSecret
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.json());
    app.use(express.static('public'));

    app.set('views', './views');
    app.set('view engine', 'ejs');

    return app;
}
