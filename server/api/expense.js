const express = require('express');
const router = express.Router();
const expenseController = require('./../controllers/expenseController')
const { authenticateToken } = require('./../utils/auth')

router.get('/expenses', authenticateToken, expenseController.get);

router.get('/expenses-analysis', authenticateToken, expenseController.analysisChart);

router.post('/expense', authenticateToken, expenseController.create);

router.post('/expense/:id', authenticateToken, expenseController.update);

router.delete('/expense/:id', authenticateToken, expenseController.delete);

module.exports = router;