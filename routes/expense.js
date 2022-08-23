const path = require('path');

const express = require('express');

const publicController = require('../controllers/expense');

const router = express.Router();

// router.get('/', publicController.getIndex);

router.post('/user/signup', publicController.registerUser);

router.post('/user/login', publicController.loginUser);


module.exports = router;