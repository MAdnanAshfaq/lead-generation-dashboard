const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'failed'],
        default: 'pending'
    },
    targets: {
        jobsFetched: {
            type: Number,
            required: true
        },
        jobsApplied: {
            type: Number,
            required: true
        }
    },
    achievements: {
        jobsFetched: {
            type: Number,
            default: 0
        },
        jobsApplied: {
            type: Number,
            default: 0
        }
    },
    profileWiseData: [{
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        target: Number
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Target', TargetSchema);
