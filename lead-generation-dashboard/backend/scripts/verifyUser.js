const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const verifyUser = async () => {
    try {
        await connectDB();
        console.log('Connected to database:', mongoose.connection.db.databaseName);

        // Find the user
        const user = await User.findOne({ email: 'manager@genesis.com' });
        
        if (!user) {
            console.log('No user found!');
            process.exit(1);
        }

        console.log('User found:', {
            id: user._id,
            email: user.email,
            role: user.role,
            hasPassword: !!user.password
        });

        // Test password
        const testPassword = 'manager123';
        const isMatch = await bcrypt.compare(testPassword, user.password);
        
        console.log('Password test:', {
            testPassword,
            hashedPassword: user.password,
            matches: isMatch
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyUser(); 