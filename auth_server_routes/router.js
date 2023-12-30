const authorizationRouter = require('./authorization.r');
const homeRouter = require('./home.r');

function route(app) {
    app.use('/', homeRouter);
    app.use('/authorization', authorizationRouter);
}

module.exports = route;