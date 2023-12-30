require('dotenv').config({ path: '.env' });

class UserController {

    show(req, res, next) {
        res.render('create');
    }


}

module.exports = new UserController();
