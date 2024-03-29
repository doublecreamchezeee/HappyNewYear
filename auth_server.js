const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const session = require('express-session');
// const passport = require('passport');

dotenv.config({
    path: '.env'
});
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const options = {
    key: fs.readFileSync('./https/localhost-key.pem'),
    cert: fs.readFileSync('./https/localhost.pem'),
};

const route = require('./auth_server_routes/router');
const handlebars = require('./configs/hdb-config');

const app = express();
app.use(express.json());
// app.use("/public",express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, './')));
app.use(express.urlencoded({
    extended: true
}));
const port = process.env['AUTH_SERVER_PORT'] || 3003;
app.use(cookieParser());

handlebars(app);
route(app);

// public file

// middleware
const middleware = require('./middleware/mdw')
app.use(middleware.badRequest);
app.use(middleware.internalServer);

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());


// app.use('*', (req, res, next) => {
//     const err = new Error('Page not found');
//     err.statusCode = 404;
//     next();
// });

// app.use((err, req, res, next) => {
//     const statusCode = err.statusCode || 500;
//     res.status(statusCode)
//         .send(statusCode + " " + err.message);
// });

https.createServer(options, app).listen(port, () => {
    console.log(`Example app listening on https://localhost:${port}`);
});
