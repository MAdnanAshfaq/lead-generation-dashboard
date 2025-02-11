const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('\n=== Login Attempt ===');
        console.log('Email:', email);
        console.log('Password received:', !!password);

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User found:', !!user);
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Log user details (except password)
        console.log('Found user:', {
            id: user._id,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        });

        // Compare password
        const isMatch = await user.comparePassword(password);
        console.log('Password comparison:', {
            inputPassword: password,
            hashedPassword: user.password,
            isMatch: isMatch
        });

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        console.log('Login successful, token generated');

        // Send response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 