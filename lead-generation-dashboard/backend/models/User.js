const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
        default: 'EMPLOYEE',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has specific permission
UserSchema.methods.hasPermission = async function(permission) {
    try {
        await this.populate('profile');
        return this.profile.permissions.includes(permission);
    } catch (error) {
        return false;
    }
};

// Log user creation
UserSchema.pre('save', function(next) {
    console.log('Creating/Updating user:', {
        email: this.email,
        role: this.role
    });
    next();
});

module.exports = mongoose.model('User', UserSchema);
