const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Target',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    jobDetails: [{
        jobTitle: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        source: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['fetched', 'applied', 'rejected', 'interview', 'offered'],
            required: true
        },
        applicationDate: {
            type: Date
        },
        responseDate: {
            type: Date
        },
        notes: {
            type: String
        }
    }],
    metrics: {
        jobsFetched: {
            type: Number,
            default: 0
        },
        jobsApplied: {
            type: Number,
            default: 0
        },
        responseRate: {
            type: Number,
            default: 0
        },
        interviewRate: {
            type: Number,
            default: 0
        }
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

// Pre-save middleware to calculate metrics
achievementSchema.pre('save', function(next) {
    const jobs = this.jobDetails;
    
    this.metrics.jobsFetched = jobs.filter(job => job.status === 'fetched').length;
    this.metrics.jobsApplied = jobs.filter(job => job.status === 'applied').length;
    
    const appliedJobs = jobs.filter(job => job.status !== 'fetched');
    const responseJobs = jobs.filter(job => ['rejected', 'interview', 'offered'].includes(job.status));
    const interviewJobs = jobs.filter(job => ['interview', 'offered'].includes(job.status));
    
    this.metrics.responseRate = appliedJobs.length > 0 
        ? (responseJobs.length / appliedJobs.length) * 100 
        : 0;
        
    this.metrics.interviewRate = appliedJobs.length > 0 
        ? (interviewJobs.length / appliedJobs.length) * 100 
        : 0;
    
    next();
});

module.exports = mongoose.model('Achievement', achievementSchema);
