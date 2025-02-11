require('dotenv').config();

module.exports = {
    // Server configuration
    port: process.env.PORT || 5000,
    
    // Database configuration
    mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-Generation',
    
    // JWT configuration
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '24h',
    
    // CORS configuration
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // App configuration
    env: process.env.NODE_ENV || 'development',
    
    // Auth configuration
    defaultAdmin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'ADMIN'
    },
    
    // Roles configuration
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
}; 

const secret = process.env.JWT_SECRET; 