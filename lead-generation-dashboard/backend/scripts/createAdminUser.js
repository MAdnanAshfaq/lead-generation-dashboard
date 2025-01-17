const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/lead-generation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected');
    try {
        // Define a simple user schema
        const userSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            role: String,
            status: {
                type: String,
                default: 'active'
            }
        });
        
        // Create model
        const User = mongoose.model('User', userSchema);

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@admin.com' });
        
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@admin.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        await admin.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@admin.com');
        console.log('Password: Admin@123');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
