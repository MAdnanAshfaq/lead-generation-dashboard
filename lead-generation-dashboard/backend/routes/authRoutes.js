const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Debug middleware
router.use((req, res, next) => {
    console.log('Auth route accessed:', req.path);
    next();
});

// Login route
router.post('/login', login);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes working' });
});

module.exports = router; 