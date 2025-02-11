const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use environment variable with fallback
        const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-Generation';
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true
        });

        // Log successful connection
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database name:', conn.connection.db.databaseName);

        // Verify database exists and log available collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit process, let the calling code handle the error
        throw error;
    }
};

module.exports = connectDB;
