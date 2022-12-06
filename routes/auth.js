const express = require('express');

const authController = require('./../controllers/auth');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/login', authController.getLoginPage);

router.post('/login', authController.postLogin);

router.post('/logout', isAuth, authController.postLogout);

router.get('/signup', authController.getSignupPage);

router.post('/signup', authController.postSignup);

module.exports = router;
