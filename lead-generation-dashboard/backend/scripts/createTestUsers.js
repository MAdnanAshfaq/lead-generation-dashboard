const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const users = [
    {
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'Admin@123',
        role: 'admin'
    },
    {
        name: 'John Manager',
        email: 'john@test.com',
        password: 'Test@123',
        role: 'manager'
    },
    {
        name: 'Alice Employee',
        email: 'alice@test.com',
        password: 'Test@123',
        role: 'employee'
    },
    {
        name: 'Bob Employee',
        email: 'bob@test.com',
        password: 'Test@123',
        role: 'employee'
    },
    {
        name: 'Charlie Employee',
        email: 'charlie@test.com',
        password: 'Test@123',
        role: 'employee'
    }
];

async function createTestUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/lead-generation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // First, delete all existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create users with hashed passwords
        for (const userData of users) {
            // Create user without hashing password
            const user = new User(userData);
            
            // Let the User model's pre-save middleware handle password hashing
            await user.save();
            console.log(`Created user: ${userData.name} (${userData.email})`);
        }

        console.log('\nTest users created successfully!');
        console.log('\nLogin credentials:');
        users.forEach(user => {
            console.log(`\nName: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${user.password}`);
            console.log(`Role: ${user.role}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error creating test users:', error);
        process.exit(1);
    }
}

createTestUsers();
