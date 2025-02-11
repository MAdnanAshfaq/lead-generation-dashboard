const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to database:', mongoose.connection.db.databaseName);
        
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create password hash
        const password = 'manager123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        console.log('Creating user with hashed password');

        const user = {
            name: 'Manager User',
            email: 'manager@genesis.com',
            password: hashedPassword,
            role: 'MANAGER'
        };

        // Create user
        const createdUser = await User.create(user);
        console.log('User created with ID:', createdUser._id);

        // Verify the created user
        const verifyUser = await User.findOne({ email: 'manager@genesis.com' });
        const passwordMatch = await bcrypt.compare('manager123', verifyUser.password);
        
        console.log('Verification results:', {
            userFound: !!verifyUser,
            passwordMatch,
            email: verifyUser.email,
            role: verifyUser.role
        });

        console.log('User created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

// Run the seed
seedUsers();
