const express = require('express');
const router = express.Router();
const passport = require('passport');
// const authenticate = require('../middlewares/auth');

const userController = require('../app/controllers/user.c');

router.get('/profile', userController.renderProfile);
router.post('/profile', userController.postProfile);
router.get('/edit', userController.renderUpdateProfile);
router.post('/edit',userController.postUpdateProfile);
// router.get('/inbox', authenticate.signIn("http://localhost:21575/user/inbox"), userController.inbox);
router.get('/signout', userController.signOut);


module.exports = router;