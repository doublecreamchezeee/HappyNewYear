const express = require('express');
const app = express();
const session = require('express-session');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
// const passport = require('passport');

dotenv.config({
    path: '.env'
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
app.use(cookieParser());
const secret = process.env.SECRET_KEY;
const maxAge = 60 * 60 * 1000;
app.use(cookieParser(secret))
app.use(
    session({
        secret: secret,
        resave: true,
        saveUninitialized: false,
        cookie: {maxAge: maxAge},
    })
);

const route = require('./server_routes/router');
const handlebars = require('./configs/hdb-config');

handlebars(app);
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));
app.use(express.urlencoded({
    extended: true
}));

const port = process.env['GAME_SERVER_PORT'] || 21575;

route(app);

// require('./configs/passport-config')(app);

// // middleware
// const middleware = require('./middleware/mdw')
// app.use(middleware.badRequest);
// app.use(middleware.internalServer);



server.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
