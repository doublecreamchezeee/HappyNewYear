const authorizationRouter = require('./authorization.r');
const homeRouter = require('./home.r');

function route(app) {


    app.use('/authorization', authorizationRouter);
    app.use('/', homeRouter);
}

module.exports = route;