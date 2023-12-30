const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/home.c');


router.get('/', (req, res, next) => {
    console.log('res' , req.cookies)
    res.render('homegame', {
        layout: 'game',
        showHeader: true,
        username: req.cookies.username,
    });
})




module.exports = router;