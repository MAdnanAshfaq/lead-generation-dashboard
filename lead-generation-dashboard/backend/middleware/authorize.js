const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Convert roles to uppercase for comparison
        const userRole = req.user.role.toUpperCase();
        const allowedRoles = roles.map(role => role.toUpperCase());

        if (roles.length && !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Forbidden - insufficient permissions'
            });
        }

        next();
    };
};

module.exports = authorize; 