const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Profile = require('../models/Profile');

const profiles = [
    {
        name: 'Raul Rivas',
        department: 'Sales',
        position: 'Sales Representative',
        location: 'New York',
        status: 'active'
    },
    {
        name: 'Raul Sanz',
        department: 'Marketing',
        position: 'Marketing Manager',
        location: 'Los Angeles',
        status: 'active'
    },
    {
        name: 'Raul Eduardo',
        department: 'Sales',
        position: 'Sales Manager',
        location: 'Miami',
        status: 'active'
    },
    {
        name: 'Demar Messado',
        department: 'Marketing',
        position: 'Marketing Representative',
        location: 'Chicago',
        status: 'active'
    }
];

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/lead-generation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected');

        // Clear existing collections
        await Promise.all([
            mongoose.connection.collection('users').drop().catch(() => console.log('Users collection does not exist')),
            mongoose.connection.collection('profiles').drop().catch(() => console.log('Profiles collection does not exist'))
        ]);

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);
        
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@admin.com');
        console.log('Password: Admin@123');

        // Create profiles
        await Profile.insertMany(profiles);
        console.log('Profiles created successfully');

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
