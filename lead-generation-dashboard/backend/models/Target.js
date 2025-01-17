const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
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
    targets: {
        jobsFetched: {
            type: Number,
            required: true,
            min: 0
        },
        jobsApplied: {
            type: Number,
            required: true,
            min: 0
        }
    },
    achievements: {
        jobsFetched: {
            type: Number,
            default: 0,
            min: 0
        },
        jobsApplied: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    profileWiseData: [{
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        targets: {
            jobsFetched: {
                type: Number,
                required: true,
                min: 0
            },
            jobsApplied: {
                type: Number,
                required: true,
                min: 0
            }
        },
        achievements: {
            jobsFetched: {
                type: Number,
                default: 0,
                min: 0
            },
            jobsApplied: {
                type: Number,
                default: 0,
                min: 0
            }
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    completionRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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

// Pre-save middleware to calculate completion rate
targetSchema.pre('save', function(next) {
    const totalTargets = this.targets.jobsFetched + this.targets.jobsApplied;
    const totalAchievements = this.achievements.jobsFetched + this.achievements.jobsApplied;
    
    this.completionRate = totalTargets > 0 
        ? (totalAchievements / totalTargets) * 100 
        : 0;
    
    next();
});

module.exports = mongoose.model('Target', targetSchema);
