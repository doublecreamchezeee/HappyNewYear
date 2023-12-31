require('dotenv').config({ path: '.env' });
const bcrypt = require('bcrypt');
const users = require('../models/user.m')
class UserController {
    async renderProfile(req,res){
        const token = req.cookies.accessToken || "";
        console.log('query', req.query);
        console.log('body', req.body);
        console.log('cookie', req.cookies);
        const user = await users.getAccount(req.cookies.username);
        console.log('User from token cua profile', user);
        if (user && token != "") {
            res.render("profile", { user, username: user.username });
        } else {
            res.redirect("/");
        }
    }
    async postProfile(req, res) {
        console.log('body post', req.body);
        const token = req.body.accessToken || "";
        const username = await users.getAccount(req.body.username);
        console.log('User from token cua profile post', username);
        if (username && token != "") {
            res.redirect(`/profile`);
        } else {
            res.redirect("/");
        }
    }
    async renderUpdateProfile(req, res) {
        const token = req.cookies.accessToken || "";
        
        const user = await users.getAccount(req.cookies.username);
        console.log('User from token cua profile', user);
        if (user) {
            res.render("updateProfile", { user, username: user.username });
        } else {
            console.log('Error in renderUpdateProfile');
            res.redirect("/");
        }
    }
    
    
    async postUpdateProfile(req, res) {
        console.log('body post', req.body);
        const token = req.body.accessToken || "";
        console.log('Post update profile body', req.body);
        const { username, name, password } = req.body;
        if (username) {
            const hashed = await bcrypt.hash(password, 10);
            await users.update(username, name, hashed);
            res.redirect(`/user/profile`);
        } else {
            console.log('Error in postUpdateProfile');
            res.redirect("/");
        }
    }
    signOut(req, res, next) {
        res.redirect(`${process.env.AUTH_SERVER_URL}/authorization/signout/${req.cookies.username}?callbackURL=${process.env.CALLBACK_URL}`)
    }


}

module.exports = new UserController();
