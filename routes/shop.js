const express = require('express');
const path = require('path');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

router.get('/', shopController.getIndexPage);

router.get('/products', shopController.getProductPage);

router.get('/products/:productId', isAuth, shopController.getProductDetail);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart/delete-cart', isAuth, shopController.postDeleteCart);

router.get('/order', isAuth, shopController.getOrder);

router.post('/create/order', isAuth, shopController.postCreateOrder)

router.get('/checkout', isAuth, shopController.getCheckout);

module.exports = router;