const express = require('express');
const router = express.Router();

// Example API route
router.get('/example', (req, res) => {
    res.json({ message: 'Hello from API!' });
});

module.exports = router;