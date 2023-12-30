const LocalStrategy = require('passport-local').Strategy
const users = require('../app/models/user.m')
const bcrypt = require('bcrypt')

function initialize(passport) {
    const authenticate = async (username, password, done) => {
        console.log(username, password)
        const usersT = await users.getUserByUsername(username);
        const user = usersT[0];
        // console.log('user in passport-config', user)
        if (!user) {
            return done(null, false, { message: 'No user with that username'});
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Password incorrect'})
            }
         
        } catch(e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password'},authenticate))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => done(null, await users.getUserById(id)));
}

module.exports = initialize