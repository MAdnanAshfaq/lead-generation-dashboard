const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET /api/profiles
// @desc    Get all profiles with their assignments
// @access  Manager/Employee
router.get('/', protect, async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('assignments.employee', 'name email role');
        
        res.json({
            success: true,
            data: profiles
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching profiles',
            error: error.message 
        });
    }
});

// @route   GET /api/profiles/:profileId
// @desc    Get single profile with assignments and targets
// @access  Manager/Employee
router.get('/:profileId', protect, async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.profileId)
            .populate('assignments.employee', 'name email role');
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// @route   POST /api/profiles/assign
// @desc    Assign profile to employee
// @access  Manager only
router.post('/assign', protect, authorize('manager'), async (req, res) => {
    try {
        const { profileId, userId } = req.body;

        // Check if profile exists
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Check if user exists and is an employee
        const user = await User.findById(userId);
        if (!user || user.role !== 'employee') {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if employee is already assigned to this profile
        const existingAssignment = profile.assignments.find(
            assignment => assignment.employee.toString() === userId
        );

        if (existingAssignment) {
            return res.status(400).json({ message: 'Employee is already assigned to this profile' });
        }

        // Add new assignment
        profile.assignments.push({
            employee: userId,
            targets: []
        });

        await profile.save();
        
        const updatedProfile = await Profile.findById(profileId)
            .populate('assignments.employee', 'name email role');

        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning profile', error: error.message });
    }
});

// @route   POST /api/profiles/:profileId/targets
// @desc    Add target to employee's profile assignment
// @access  Manager only
router.post('/:profileId/targets', protect, authorize('manager'), async (req, res) => {
    try {
        const { month, year, targetAmount, userId } = req.body;
        
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Find the employee's assignment
        const assignment = profile.assignments.find(
            a => a.employee.toString() === userId
        );

        if (!assignment) {
            return res.status(404).json({ message: 'Employee is not assigned to this profile' });
        }

        // Check if target already exists for the month and year
        const existingTarget = assignment.targets.find(
            target => target.month === month && target.year === year
        );

        if (existingTarget) {
            return res.status(400).json({ 
                message: 'Target already exists for this month and year' 
            });
        }

        // Add new target
        assignment.targets.push({
            month,
            year,
            targetAmount,
            achievedAmount: 0,
            status: 'pending'
        });

        await profile.save();
        
        const updatedProfile = await Profile.findById(req.params.profileId)
            .populate('assignments.employee', 'name email role');

        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error adding target', error: error.message });
    }
});

// @route   PUT /api/profiles/:profileId/targets/:targetId
// @desc    Update target progress
// @access  Manager/Employee
router.put('/:profileId/targets/:targetId', protect, async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.profileId);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Find the assignment and target
        const assignment = profile.assignments.find(a => {
            return a.targets.some(t => t._id.toString() === req.params.targetId);
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Target not found' });
        }

        const target = assignment.targets.find(t => t._id.toString() === req.params.targetId);

        // If user is employee, they can only update achievedAmount
        if (req.user.role === 'employee') {
            if (req.body.achievedAmount !== undefined) {
                target.achievedAmount = req.body.achievedAmount;
                target.status = 'in_progress';
                
                // Auto-update status to completed if target is met
                if (target.achievedAmount >= target.targetAmount) {
                    target.status = 'completed';
                }
            }
        } else if (req.user.role === 'manager') {
            // Managers can update all fields
            Object.assign(target, req.body);
        }

        await profile.save();
        
        const updatedProfile = await Profile.findById(req.params.profileId)
            .populate('assignments.employee', 'name email role');

        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating target', error: error.message });
    }
});

// @route   GET /api/profiles/employee/:userId
// @desc    Get profiles assigned to an employee
// @access  Manager/Employee
router.get('/employee/:userId', protect, async (req, res) => {
    try {
        const profiles = await Profile.find({
            'assignments.employee': req.params.userId
        }).populate('assignments.employee', 'name email role');

        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profiles', error: error.message });
    }
});

// @route   POST /api/profiles/seed
// @desc    Seed initial profiles
// @access  Admin only
router.post('/seed', async (req, res) => {
    try {
        // Delete existing profiles
        await Profile.deleteMany({});

        // Create new profiles
        const profiles = await Promise.all([
            new Profile({
                name: 'Raul Rivas',
                status: 'active',
                assignments: []
            }).save(),
            new Profile({
                name: 'Raul Sanz',
                status: 'active',
                assignments: []
            }).save(),
            new Profile({
                name: 'Raul Eduardo',
                status: 'active',
                assignments: []
            }).save(),
            new Profile({
                name: 'Demar Messado',
                status: 'active',
                assignments: []
            }).save()
        ]);

        res.json({
            success: true,
            message: 'Profiles seeded successfully',
            data: profiles
        });
    } catch (error) {
        console.error('Error seeding profiles:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error seeding profiles',
            error: error.message 
        });
    }
});

module.exports = router;
