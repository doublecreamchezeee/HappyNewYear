const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/home.c')

router.get('/', (req, res, next) => {
    res.render('homegame', {
        layout: 'game',
        showHeader: true,
    });
})




module.exports = router