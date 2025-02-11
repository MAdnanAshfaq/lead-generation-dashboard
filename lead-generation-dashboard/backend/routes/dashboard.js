const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Target = require('../models/Target');
const Achievement = require('../models/Achievement');

// @route   GET /api/dashboard/manager/stats
// @desc    Get manager dashboard statistics
// @access  Manager only
router.get('/manager/stats', auth, authorize('manager'), async (req, res) => {
    try {
        console.log('Fetching real-time manager stats for user:', req.user.id);

        // Get total employees (excluding managers)
        const totalEmployees = await User.countDocuments({ 
            role: 'EMPLOYEE',
            isActive: true 
        });

        // Get active profiles
        const activeProfiles = await Profile.countDocuments({ 
            isActive: true 
        });

        // Get monthly targets (for current month)
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const monthlyTargets = await Target.countDocuments({
            startDate: { $gte: startOfMonth },
            endDate: { $lte: endOfMonth }
        });

        // Get completed targets for current month
        const completedTargets = await Target.countDocuments({
            startDate: { $gte: startOfMonth },
            endDate: { $lte: endOfMonth },
            status: 'completed'
        });

        const stats = {
            totalEmployees,
            activeProfiles,
            monthlyTargets,
            completedTargets,
            // Additional useful stats
            lastUpdated: new Date(),
            periodRange: {
                start: startOfMonth,
                end: endOfMonth
            }
        };

        console.log('Sending real-time stats:', stats);
        res.json(stats);

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard statistics',
            error: error.message 
        });
    }
});

// @route   GET /api/dashboard/manager/detailed-stats
// @desc    Get detailed statistics including employee performance
// @access  Manager only
router.get('/manager/detailed-stats', auth, authorize('manager'), async (req, res) => {
    try {
        // Get employee performance stats
        const employeeStats = await User.aggregate([
            { $match: { role: 'EMPLOYEE', isActive: true } },
            {
                $lookup: {
                    from: 'targets',
                    localField: '_id',
                    foreignField: 'employeeId',
                    as: 'targets'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalTargets: { $size: '$targets' },
                    completedTargets: {
                        $size: {
                            $filter: {
                                input: '$targets',
                                as: 'target',
                                cond: { $eq: ['$$target.status', 'completed'] }
                            }
                        }
                    }
                }
            }
        ]);

        // Get profile statistics
        const profileStats = await Profile.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const detailedStats = {
            employeePerformance: employeeStats,
            profileDistribution: profileStats,
            lastUpdated: new Date()
        };

        console.log('Sending detailed stats:', detailedStats);
        res.json(detailedStats);

    } catch (error) {
        console.error('Error fetching detailed stats:', error);
        res.status(500).json({ 
            message: 'Error fetching detailed statistics',
            error: error.message 
        });
    }
});

// @route   GET /api/dashboard/employee/stats
// @desc    Get employee dashboard statistics
// @access  Employee only
router.get('/employee/stats', auth, authorize('employee'), async (req, res) => {
    try {
        const stats = {
            assignedLeads: 20,
            qualifiedLeads: 15,
            monthlyTarget: 30,
            completedTarget: 15
        };
        res.json(stats);
    } catch (error) {
        console.error('Error fetching employee stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
});

// Add a test route to directly check profile count
router.get('/test/profiles', auth, authorize('manager'), async (req, res) => {
    try {
        const profiles = await Profile.find({});
        res.json({
            count: profiles.length,
            profiles: profiles
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching profiles',
            error: error.message 
        });
    }
});

// @route   GET /api/dashboard/admin/stats
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/admin/stats', auth, authorize('ADMIN'), async (req, res) => {
    try {
        // Get system statistics
        const stats = {
            users: {
                total: await User.countDocuments(),
                managers: await User.countDocuments({ role: 'MANAGER' }),
                employees: await User.countDocuments({ role: 'EMPLOYEE' }),
                active: await User.countDocuments({ status: 'active' }),
                inactive: await User.countDocuments({ status: 'inactive' })
            },
            profiles: {
                total: await Profile.countDocuments(),
                active: await Profile.countDocuments({ status: 'active' }),
                inactive: await Profile.countDocuments({ status: 'inactive' })
            },
            targets: {
                total: await Target.countDocuments(),
                completed: await Target.countDocuments({ status: 'completed' }),
                pending: await Target.countDocuments({ status: 'pending' })
            },
            achievements: {
                total: await Achievement.countDocuments(),
                thisMonth: await Achievement.countDocuments({
                    createdAt: {
                        $gte: new Date(new Date().setDate(1)), // First day of current month
                        $lte: new Date()
                    }
                })
            }
        };

        // Get recent activities (last 10)
        const recentActivities = await Achievement.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'email role')
            .populate('profile', 'name');

        // Get recent users (last 5)
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                stats,
                recentActivities,
                recentUsers
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching admin dashboard statistics',
            error: error.message 
        });
    }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard data
// @access  Admin only
router.get('/admin', auth, async (req, res) => {
    try {
        // Verify user is admin
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Get counts
        const userCount = await User.countDocuments();
        const profileCount = await Profile.countDocuments();
        const targetCount = await Target.countDocuments();

        // Get recent users
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent profiles
        const recentProfiles = await Profile.find()
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            data: {
                counts: {
                    users: userCount,
                    profiles: profileCount,
                    targets: targetCount
                },
                recentUsers,
                recentProfiles
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching dashboard data' 
        });
    }
});

module.exports = router;
