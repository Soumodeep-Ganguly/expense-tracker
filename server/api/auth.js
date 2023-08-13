const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController')

router.post('/auth', authController.signUp);

router.post('/auth/signin', authController.signIn);

module.exports = router;