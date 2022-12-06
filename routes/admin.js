const express = require('express');
const path = require('path');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

router.get('/add-product', isAuth, adminController.getAddProductPage);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product', isAuth, adminController.postProduct);

router.post('/edit-product', isAuth, adminController.postEditProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);

router.delete('/delete-product/:productId', isAuth, adminController.postDeleteProduct);

module.exports = router;