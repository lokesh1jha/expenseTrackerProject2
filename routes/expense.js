const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const expenseController = require('../controllers/expenseRecord');
const authenticatemiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/signup', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/addexpense',authenticatemiddleware.authenticate, expenseController.addExpense);

router.get('/getexpense',authenticatemiddleware.authenticate, expenseController.getExpense);

router.get('/leaderboard',authenticatemiddleware.authenticate, expenseController.leaderboard);

module.exports = router;