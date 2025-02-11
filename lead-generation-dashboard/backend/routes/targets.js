const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Target = require('../models/Target');
const Achievement = require('../models/Achievement');

// Middleware to check manager role
const checkManagerRole = (req, res, next) => {
    console.log('Checking manager role:', {
        user: req.user,
        role: req.user?.role
    });

    if (req.user.role !== 'MANAGER') {
        return res.status(403).json({ 
            message: 'Forbidden - insufficient permissions',
            required: 'MANAGER',
            provided: req.user.role 
        });
    }
    next();
};

// @route   POST /api/targets
// @desc    Create a new target
// @access  Manager only
router.post('/', auth, checkManagerRole, async (req, res) => {
    try {
        console.log('Creating target:', {
            body: req.body,
            user: req.user
        });

        const { employeeId, type, value, deadline } = req.body;
        
        const target = new Target({
            employeeId,
            type,
            value,
            deadline,
            assignedBy: req.user.id
        });

        await target.save();
        res.status(201).json(target);
    } catch (error) {
        console.error('Error creating target:', error);
        res.status(500).json({ message: 'Error creating target' });
    }
});

// @route   GET /api/targets/employee/:userId
// @desc    Get employee targets
// @access  Private
router.get('/employee/:userId', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, startDate, endDate } = req.query;

        // Check authorization
        if (req.user.role === 'employee' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Not authorized to view other employee targets' });
        }

        const query = {
            userId,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        };

        if (type) {
            query.type = type;
        }

        const targets = await Target.find(query)
            .populate('profileWiseData.profile')
            .sort({ startDate: -1 });

        res.json(targets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching targets', error: error.message });
    }
});

// @route   PUT /api/targets/:targetId/achievements
// @desc    Update target achievements
// @access  Private
router.put('/:targetId/achievements', auth, async (req, res) => {
    try {
        const { targetId } = req.params;
        const { achievements, profileWiseData } = req.body;

        const target = await Target.findById(targetId);
        if (!target) {
            return res.status(404).json({ message: 'Target not found' });
        }

        // Check authorization
        if (req.user.role === 'employee' && target.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this target' });
        }

        target.achievements = achievements;
        target.profileWiseData = profileWiseData;
        target.updatedBy = req.user.id;
        await target.save();

        res.json(target);
    } catch (error) {
        res.status(500).json({ message: 'Error updating achievements', error: error.message });
    }
});

// @route   POST /api/targets/:targetId/daily-achievement
// @desc    Add daily achievement
// @access  Private
router.post('/:targetId/daily-achievement', auth, async (req, res) => {
    try {
        const { targetId } = req.params;
        const { profile, jobDetails, date } = req.body;

        const target = await Target.findById(targetId);
        if (!target) {
            return res.status(404).json({ message: 'Target not found' });
        }

        // Check authorization
        if (req.user.role === 'employee' && target.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add achievement' });
        }

        const achievement = await Achievement.create({
            userId: target.userId,
            targetId,
            date,
            profile,
            jobDetails,
        });

        res.status(201).json(achievement);
    } catch (error) {
        res.status(500).json({ message: 'Error adding achievement', error: error.message });
    }
});

// @route   GET /api/targets/stats
// @desc    Get employee stats
// @access  Manager only
router.get('/stats', auth, authorize('manager'), async (req, res) => {
    try {
        const { startDate, endDate, userId, type } = req.query;

        const query = {
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        };

        if (userId) {
            query.userId = userId;
        }

        if (type) {
            query.type = type;
        }

        const targets = await Target.find(query)
            .populate('userId', 'username firstName lastName email')
            .populate('profileWiseData.profile')
            .sort({ startDate: -1 });

        const achievements = await Achievement.find({
            date: { $gte: startDate, $lte: endDate },
            ...(userId && { userId })
        }).populate('profile');

        res.json({
            targets,
            achievements
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
});

// @route   GET /api/targets
// @desc    Get all targets
// @access  Manager only
router.get('/', auth, authorize('manager'), async (req, res) => {
    try {
        const targets = await Target.find()
            .populate('employeeId', 'email')
            .populate('assignedBy', 'email');
        res.json(targets);
    } catch (error) {
        console.error('Error fetching targets:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/targets/:id
// @desc    Update target
// @access  Manager only
router.put('/:id', auth, authorize('manager'), async (req, res) => {
    try {
        const target = await Target.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!target) {
            return res.status(404).json({ message: 'Target not found' });
        }
        res.json(target);
    } catch (error) {
        console.error('Error updating target:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/targets/:id
// @desc    Delete target
// @access  Manager only
router.delete('/:id', auth, authorize('manager'), async (req, res) => {
    try {
        const target = await Target.findByIdAndDelete(req.params.id);
        if (!target) {
            return res.status(404).json({ message: 'Target not found' });
        }
        res.json({ message: 'Target deleted successfully' });
    } catch (error) {
        console.error('Error deleting target:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
