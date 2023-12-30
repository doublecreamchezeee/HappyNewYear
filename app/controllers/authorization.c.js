// const passport = require('passport');
require('dotenv').config({
    path: './env'
})
const jwtH = require('../../helpers/jwt.h');
// const bcrypt = require('bcrypt');
// const users = require('../models/user.m');
const CALLBACK_URL = process.env.CALLBACK_URL;
const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;

class AuthorizationController {

    async request(req, res, next) {
        try {
            console.log('cookies in request: ', req.cookies);
            if (!req.cookies['accessToken']) {
                console.log("Acces1: ", !req.cookies['accessToken']);
                res.redirect(`${AUTH_SERVER_URL}/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                return;
            }

            if (jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET)) {
                console.log('Access2: ', jwtH.isExpired(req.cookies['accessToken'], process.env.ACCESS_TOKEN_SECRET));
                const account = await accountModel.getAccount(req.cookies.username);
                const refreshToken = account.Token;
                const username = account.Username;
                if (jwtH.isExpired(refreshToken, process.env.REFRESH_TOKEN_SECRET)) {
                    res.redirect(`${AUTH_SERVER_URL}/authorization/signin?callbackURL=${CALLBACK_URL}`,);
                    return;
                }

                const response = await fetch(`${AUTH_SERVER_URL}/authorization/tokens`, {
                    method: 'POST',
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username
                    }),
                });
                const tokens = await response.json();
                await accountModel.updateRefreshToken(username, tokens.refreshToken);
                res.cookie("accessToken", tokens.accessToken);
                res.cookie("username", username);
            }
            res.redirect('/');
        } catch (err) {
            next(err);
        }
    }

    login_get(req, res, next){
        res.render('login', {
            layout: 'auth',
            showHeader: true,
        });
    }

    login_post(req,res,next){
        console.log('Login:');
        const username = req.body.username
        const password = req.body.password
        console.log("un:", username)  
        console.log("pw:" + password)
    }

    async register_post(req, res, next){
        // console.log(req.body);
        let name = req.body.name
        let username = req.body.username
        let password = req.body.password
        // let isValid = true;

        // let regex = /^[A-Z][a-zA-Z]*$/
        // if (!name.match(regex)) {
        //     name = 'Tên chỉ được chứa kí tự chữ và chữ cái đầu tiên phải được in hoa !'
        //     isValid = false
        // }
        // regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{4,}$/
        // if (!username.match(regex)) {
        //     username = 'Tên người dùng có ít nhất 4 ký tự, có cả chữ và số !'
        //     isValid = false
        // }
        // // users = await Users.getUserByUsername(username);
        // if (users.length > 0) {
        //     username = 'Tên người dùng đã có người đặt !'
        //     isValid = false
        // }
        // regex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/
        // if (!password.match(regex)) {
        //     password = 'Mật khẩu có ít nhất 6 ký tự, có cả chữ và số !'
        //     isValid = false
        // }
        // if (!isValid) {
        //     console.log('not valid');
        //     return res.json({firstname, lastname, email, username, password, isValid})
        // }
        try {
            console.log(req.body);
            // const hashedPassword = await bcrypt.hash(req.body.password, 10);
            // const user = {
            //     email: req.body.email,
            //     username: req.body.username,
            //     password: hashedPassword,
            //     name: req.body.name,
            // }
            // // const data = await Users.insert(user);
            // res.json({email, username, password, name})
            res.redirect('back');
        }
        catch (e) {
            console.log(e)
            res.redirect('/signup');
        }
            
    }

    register_get(req,res,next){
        res.render('register', {
            layout: 'auth',
            showHeader: true,
        });
    }

    async getTokens(req, res, next) {
        const username = req.body.username;
        try {
            const tokens = jwtH.generateTokens(username, '5m');
            res.json(tokens);

        } catch (error) {
            next(error);
        }
    }

    async signOut(req, res, next) {
        try {
            const username = req.params.username;
            await accountModel.updateRefreshToken(username, null);
            res.clearCookie('accessToken');
            res.clearCookie('username');
            res.redirect('/');
        } catch (error) {
            next(error)
        }
    }


}

module.exports = new AuthorizationController();
