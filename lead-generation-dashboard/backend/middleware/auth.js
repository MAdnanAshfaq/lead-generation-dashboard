const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password').populate('profile');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this route' });
    }
};

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
