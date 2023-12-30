// const passport = require('passport');
require('dotenv').config({
    path: './env'
})
const jwtH = require('../../helpers/jwt.h');
const bcrypt = require('bcrypt');
const users = require('../models/user.m');
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
                const account = await users.getAccount(req.cookies.username);
                const refreshToken = account.token;
                const username = account.username;
                console.log(account);
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
                await users.updateRefreshToken(username, tokens.refreshToken);
                res.cookie("accessToken", tokens.accessToken);
                res.cookie("username", username);
                // res.json(username);
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
            callbackURL: req.query.callbackURL,
        });
    }

    async login_post(req,res,next){
        console.log('Login:' , req.body);

        const username = req.body.username
        const password = req.body.password
        const callbackURL = req.body.callbackURL
        const expAccessToken = req.body.expire;
        console.log("un:", username)  
        console.log("pw:", password)

        try{
            const account = await users.getAccount(username);
            console.log('Account: ', account)
            if (account === null){
                console.log('Account has not existed');
                return;
            }
            const checkPassword = await bcrypt.compare(password, account.password);
            console.log('Checkpass', checkPassword);
            if (!checkPassword){
                console.log('Password is wrong');
                res.redirect(`${AUTH_SERVER_URL}/authorization/signin?callbackURL=${CALLBACK_URL}`)
                return;
            }
            
            console.log('Login success')
            const tokens = jwtH.generateTokens(username, expAccessToken);
            await users.updateRefreshToken(username,tokens.refreshToken);
            res.cookie("accessToken",tokens.accessToken);
            res.cookie("username",username);
            res.redirect(callbackURL);
            
            
        } catch(error) {
            next(error);
        }
    }

    async register_post(req, res, next){
        // console.log(req.body);
        // let name = req.body.name
        // let username = req.body.username
        // let password = req.body.password
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
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                // avatar: req.body.avatar,
                username: req.body.username,
                password: hashedPassword,
                name: req.body.name,
            }
            const data = await users.add(user);
            // res.json({username, password, name})
            res.redirect('/');
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
            await users.updateRefreshToken(username, null);
            res.clearCookie('accessToken');
            res.clearCookie('username');
            res.redirect(CALLBACK_URL);
        } catch (error) {
            next(error)
        }
    }

    async validate(req,res,next) {
        // Replace this with your actual validation logic
        const isValid = await validateFormData(req.body);
        console.log('is valid signup data: ',isValid)
        // Respond with a JSON object indicating the validation result
        res.json({
            isValid: isValid.isValid,
            message: isValid.message
        });
    }



}

async function validateFormData(formData) {
    const username = formData.username;
    const password = formData.password;

    // Check if the username and password are provided
    if (!username || !password) {
        return { isValid: false, message: 'Please provide both username and password.' };
    }

    // Find the user in the database
    const user = await users.getAccount(username);
    console.log(user)
    // Check if the user exists
    if (user !== null ) {
        return { isValid: false, message: 'Invalid username.' };
    }

    // If everything is valid, return true
    return { isValid: true, message: 'Validation successful' };
}

module.exports = new AuthorizationController();
