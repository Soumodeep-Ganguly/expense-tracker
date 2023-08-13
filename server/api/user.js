const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')
const { authenticateToken } = require('./../utils/auth')

router.get('/user', authenticateToken, userController.get);

module.exports = router;