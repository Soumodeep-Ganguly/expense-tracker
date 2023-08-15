const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController')
const { authenticateToken } = require('./../utils/auth')

router.get('/user', authenticateToken, userController.get);

router.put('/user', authenticateToken, userController.update);

module.exports = router;