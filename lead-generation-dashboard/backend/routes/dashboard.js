const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');

// @route   GET /api/dashboard/manager/stats
// @desc    Get manager dashboard statistics
// @access  Manager only
router.get('/manager/stats', protect, authorize('manager'), async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const activeProfiles = await Profile.countDocuments({ status: 'active' });
        const monthlyTargets = 0; // Replace with actual logic to calculate monthly targets
        const completedTargets = 0; // Replace with actual logic to calculate completed targets

        res.json({
            totalEmployees,
            activeProfiles,
            monthlyTargets,
            completedTargets
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
    }
});

module.exports = router;
