const express = require('express');
const router = express.Router();
const expenseController = require('./../controllers/expenseController')
const { authenticateToken } = require('./../utils/auth')

router.get('/expenses', authenticateToken, expenseController.get);

module.exports = router;