const path = require('path');

const express = require('express');

const publicController = require('../controllers/expense');

const router = express.Router();

// router.get('/', shopController.getIndex);

router.post('/signup', publicController.registerUser);

// router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', shopController.getCart);

// router.post('/cart', shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

module.exports = router;