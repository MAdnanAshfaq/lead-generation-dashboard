const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const Target = require('../models/Target');
const Profile = require('../models/Profile');
const Achievement = require('../models/Achievement');

// @route   GET /api/manager/employees
// @desc    Get all employees under manager
// @access  Manager only
router.get('/employees', auth, authorize('MANAGER'), async (req, res) => {
    try {
        const employees = await User.find({ 
            role: 'EMPLOYEE',
            status: 'active'
        }).select('-password');
        
        res.json({
            success: true,
            data: employees
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching employees',
            error: error.message 
        });
    }
});

// @route   GET /api/manager/employee/:id/stats
// @desc    Get employee statistics
// @access  Manager only
router.get('/employee/:id/stats', auth, authorize('MANAGER'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const employeeId = req.params.id;

        const stats = await Achievement.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(employeeId),
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalJobsFetched: { $sum: '$metrics.jobsFetched' },
                    totalJobsApplied: { $sum: '$metrics.jobsApplied' },
                    avgResponseRate: { $avg: '$metrics.responseRate' },
                    avgInterviewRate: { $avg: '$metrics.interviewRate' }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats[0] || {
                totalJobsFetched: 0,
                totalJobsApplied: 0,
                avgResponseRate: 0,
                avgInterviewRate: 0
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching employee stats',
            error: error.message 
        });
    }
});

// @route   POST /api/manager/targets
// @desc    Create target for employee
// @access  Manager only
router.post('/targets', auth, authorize('MANAGER'), async (req, res) => {
    try {
        const { employeeId, type, startDate, endDate, targets } = req.body;

        const newTarget = new Target({
            employeeId,
            type,
            startDate,
            endDate,
            targets,
            createdBy: req.user.id
        });

        await newTarget.save();

        res.json({
            success: true,
            data: newTarget
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating target',
            error: error.message 
        });
    }
});

module.exports = router; 