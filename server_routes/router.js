const homeRouter = require('./home.r');
const userRouter = require('./user.r')
const authorizationRouter = require('./authorization.r');

function route(app) {
    app.use('/', homeRouter);
    app.use('/user',userRouter);
    app.use('/authorization',authorizationRouter)

}

module.exports = route;