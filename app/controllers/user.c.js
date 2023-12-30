require('dotenv').config({ path: '.env' });

class UserController {

    signOut(req, res, next) {
        res.redirect(`${process.env.AUTH_SERVER_URL}/authorization/signout/${req.cookies.username}?callbackURL=${process.env.CALLBACK_URL}`)
    }


}

module.exports = new UserController();
