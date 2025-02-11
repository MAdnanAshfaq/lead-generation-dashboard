const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');

// Debug middleware
router.use((req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.originalUrl}`);
    next();
});

// Mount auth routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

module.exports = router; 