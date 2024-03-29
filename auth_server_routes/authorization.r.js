const express = require('express');
const router = express.Router();
// const passport = require('passport')
// const initialize = require('../configs/passport-config');

const controller = require('../app/controllers/authorization.c');

router.get('/signup', controller.register_get);
router.post('/signup', controller.register_post);

router.get('/signin', controller.login_get);
// router.post('/signin', passport.authenticate('local',{
//     successRedirect: '/',
//     failureRedirect: '/signin',
//     failureFlash: true,
// }));
router.post('/signin', controller.login_post);

router.post('/tokens', controller.getTokens);

router.get('/signout/:username', controller.signOut);

router.get('/', controller.request);

router.post('/validate', controller.validate);

module.exports = router