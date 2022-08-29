const path = require('path');

const express = require('express');

const userController = require('../controllers/forgotPassword');
const router = express.Router();

router.post('/forgotpassword', userController.forgotpassword);

module.exports = router;