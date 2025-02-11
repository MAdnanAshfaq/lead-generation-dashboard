const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedManager = async () => {
    try {
        await connectDB();

        // Delete existing manager if any
        await User.deleteOne({ email: 'manager@genesis.com' });

        // Create new manager with updated credentials
        const manager = new User({
            name: 'Manager',
            email: 'manager@genesis.com',
            password: 'manager123',
            role: 'MANAGER'
        });

        await manager.save();
        console.log('Manager credentials updated successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding manager:', error);
        process.exit(1);
    }
};

seedManager(); 