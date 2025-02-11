const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const JWT_SECRET = process.env.JWT_SECRET || 'lead_generation_super_secret_key_2024';

// Mock user data (replace with database in production)
const users = [
    { id: 1, email: 'admin@leadgen.com', password: 'Admin@2024', role: 'ADMIN' },
    { id: 2, email: 'manager@genesis.com', password: 'manager123', role: 'MANAGER' },
    { id: 3, email: 'employee@genesis.com', password: 'employee123', role: 'EMPLOYEE' }
];

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role
        }
    });
});

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Admin only
router.post('/register', auth, async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password,
            role: role || 'employee'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        
        // Get user
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
});

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Public
router.post('/refresh', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
