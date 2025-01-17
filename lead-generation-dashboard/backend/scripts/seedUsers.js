const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const connectDB = require('../config/db');

const users = [
    {
        name: 'Admin User',
        email: 'admin@leadgen.com',
        password: 'Admin123!',
        role: 'admin'
    },
    {
        name: 'Manager User',
        email: 'manager@leadgen.com',
        password: 'Manager123!',
        role: 'manager'
    },
    {
        name: 'Employee User',
        email: 'employee@leadgen.com',
        password: 'Employee123!',
        role: 'employee'
    }
];

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        
        // Clear existing users
        const deleteResult = await User.deleteMany({});
        console.log('Cleared existing users:', deleteResult);
        
        // Hash passwords and create users
        const hashedUsers = await Promise.all(users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            return user;
        }));
        
        const createdUsers = await User.insertMany(hashedUsers);
        console.log('Created users:', createdUsers);
        
        // Verify the users were created
        const allUsers = await User.find({});
        console.log('All users in database:', allUsers);
        
        console.log('Users seeded successfully!');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Collections:', await mongoose.connection.db.listCollections().toArray());
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
