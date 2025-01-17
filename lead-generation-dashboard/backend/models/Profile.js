const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Raul Rivas', 'Raul Sanz', 'Raul Eduardo', 'Demar Messado']
    },
    assignments: [{
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        targets: [{
            month: {
                type: String,
                required: true
            },
            year: {
                type: Number,
                required: true
            },
            targetAmount: {
                type: Number,
                required: true
            },
            achievedAmount: {
                type: Number,
                default: 0
            },
            status: {
                type: String,
                enum: ['pending', 'in_progress', 'completed'],
                default: 'pending'
            }
        }],
        assignedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updatedAt field
profileSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
