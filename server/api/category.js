const express = require('express');
const router = express.Router();
const categoryController = require('./../controllers/categoryController')
const { authenticateToken } = require('./../utils/auth')

router.get('/categories', authenticateToken, categoryController.get);

module.exports = router;