const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.render('homegame', {
        layout: 'game',
        showHeader: true,
    });
})


module.exports = router