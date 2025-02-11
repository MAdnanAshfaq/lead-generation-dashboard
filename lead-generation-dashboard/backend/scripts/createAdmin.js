require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/lead-Generation', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Admin credentials
        const adminData = {
            email: 'admin@leadgen.com',
            password: 'Admin@2024',
            role: 'ADMIN',
            isActive: true,
            firstName: 'Admin',
            lastName: 'User'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.disconnect();
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = new User({
            ...adminData,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin user created successfully');

        // Write credentials to credentials.txt
        const fs = require('fs');
        const path = require('path');
        const credentialsPath = path.join(__dirname, '..', 'credentials.txt');
        
        const credentialsContent = `
Lead Generation Dashboard Admin Credentials
=========================================
Email: ${adminData.email}
Password: ${adminData.password}
Role: ${adminData.role}

Created on: ${new Date().toISOString()}
=========================================
        `;

        fs.writeFileSync(credentialsPath, credentialsContent);
        console.log('Credentials saved to:', credentialsPath);

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createAdmin(); 