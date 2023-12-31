const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/create.c');


router.get('/', controller.show);

module.exports = router