const mongoose = require('mongoose');
const User = require('../models/User');

mongoose.connect('mongodb://localhost:27017/lead-generation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected');
    try {
        // Create a test user
        const testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'Test@123',
            role: 'employee'
        });

        await testUser.save();
        console.log('Test user created successfully:', testUser);
        process.exit(0);
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
