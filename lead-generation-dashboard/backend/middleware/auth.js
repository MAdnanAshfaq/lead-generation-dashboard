const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/default');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

exports.checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const hasPermission = await req.user.hasPermission(permission);
            if (!hasPermission) {
                return res.status(403).json({ 
                    message: 'You do not have permission to perform this action'
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ 
                message: 'Error checking permissions',
                error: error.message
            });
        }
    };
};
