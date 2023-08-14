const express = require('express');
const router = express.Router();
const categoryController = require('./../controllers/categoryController')
const { authenticateToken } = require('./../utils/auth')

router.get('/categories', authenticateToken, categoryController.get);

router.get('/categories-select', authenticateToken, categoryController.getAll);

router.post('/category', authenticateToken, categoryController.create);

router.post('/category/:id', authenticateToken, categoryController.update);

router.delete('/category/:id', authenticateToken, categoryController.delete);

module.exports = router;