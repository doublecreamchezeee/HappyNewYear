const express = require('express');
const router = express.Router();

const controller = require('../app/controllers/authorization.c');


router.get('/', controller.request);

module.exports = router