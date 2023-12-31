const express = require('express');
const router = express.Router();


module.exports = function(io) {
    const gameController = require('../app/controllers/game.c')(io);
    router.get('/', gameController.homePage)
    return router;
}


// module.exports = router;