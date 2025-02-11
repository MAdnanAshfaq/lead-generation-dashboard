const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST /api/users
// @desc    Create a new user
// @access  Public (temporarily for testing)
router.post('/', async (req, res) => {
    console.log('Received request body:', req.body);
    
    try {
        console.log('Creating user with data:', req.body);
        const { name, email, password, role } = req.body;

        // Validation
        if (!email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = new User({
            name: name || email.split('@')[0],
            email: email.toLowerCase(),
            password,
            role: role || 'employee',
            status: 'active'
        });

        console.log('Attempting to save user:', { name: user.name, email: user.email, role: user.role });
        
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);
        
        await user.save();
        console.log('User saved successfully');

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Admin only
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/employees
// @desc    Get all employees
// @access  Manager only
router.get('/employees', auth, authorize('manager'), async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});

// @route   GET /api/users/employees
// @desc    Get all employees
// @access  Manager/Admin
router.get('/employees', auth, authorize('manager', 'admin'), async (req, res) => {
    try {
        const employees = await User.find({ 
            role: 'employee',
            status: 'active'
        }).select('name email status');
        
        res.json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching employees',
            error: error.message 
        });
    }
});

// @route   GET /api/users/employees
// @desc    Get all employees
// @access  Manager/Admin
router.get('/employees', auth, authorize('manager', 'admin'), async (req, res) => {
    try {
        const employees = await User.find({ 
            role: 'employee',
            status: 'active'
        }).select('name email status');
        
        res.json({
            success: true,
            data: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching employees',
            error: error.message 
        });
    }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { email, role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { email, role },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/users/:userId/stats
// @desc    Get user statistics
// @access  Private
router.get('/:userId/stats', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        // Check authorization
        if (req.user.role === 'employee' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Not authorized to view other user stats' });
        }

        if (req.user.role === 'manager') {
            const employee = await User.findById(userId);
            if (!employee || employee.manager.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to view this user stats' });
            }
        }

        const user = await User.findById(userId)
            .select('-password')
            .populate('assignedProfiles.profile');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stats = await Target.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                    startDate: { $gte: new Date(startDate) },
                    endDate: { $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: '$type',
                    totalTargets: {
                        $sum: {
                            $add: ['$targets.jobsFetched', '$targets.jobsApplied']
                        }
                    },
                    totalAchievements: {
                        $sum: {
                            $add: ['$achievements.jobsFetched', '$achievements.jobsApplied']
                        }
                    },
                    averageCompletion: { $avg: '$completionRate' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                user,
                stats
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user stats',
            error: error.message
        });
    }
});

// @route   POST /api/users/seed
// @desc    Seed test users
// @access  Admin only
router.post('/seed', async (req, res) => {
    try {
        // Create test employees
        const employees = [
            {
                name: 'John Employee',
                email: 'john@example.com',
                password: 'password123',
                role: 'employee',
                status: 'active'
            },
            {
                name: 'Jane Employee',
                email: 'jane@example.com',
                password: 'password123',
                role: 'employee',
                status: 'active'
            },
            {
                name: 'Bob Employee',
                email: 'bob@example.com',
                password: 'password123',
                role: 'employee',
                status: 'active'
            }
        ];

        // Create employees
        const createdEmployees = await Promise.all(
            employees.map(async (emp) => {
                const existingUser = await User.findOne({ email: emp.email });
                if (!existingUser) {
                    const user = new User(emp);
                    return user.save();
                }
                return existingUser;
            })
        );

        res.json({
            success: true,
            message: 'Test employees created successfully',
            data: createdEmployees.map(emp => ({
                name: emp.name,
                email: emp.email,
                role: emp.role,
                status: emp.status
            }))
        });
    } catch (error) {
        console.error('Error seeding test employees:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error seeding test employees',
            error: error.message 
        });
    }
});

// @route   POST /api/users/create
// @desc    Create a new user (admin only)
// @access  Admin only
router.post('/create', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const { email, password, role, name } = req.body;

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Create new user
        user = new User({
            email: email.toLowerCase(),
            password,
            role: role.toUpperCase(),
            name,
            status: 'active'
        });

        // Hash password
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userResponse
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (active/inactive)
// @access  Admin only
router.put('/:id/status', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
});

// @route   GET /api/users/all
// @desc    Get all users with filters
// @access  Admin only
router.get('/all', auth, authorize('ADMIN'), async (req, res) => {
    try {
        const { role, status, search } = req.query;
        const query = {};

        if (role) query.role = role.toUpperCase();
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { email: new RegExp(search, 'i') },
                { name: new RegExp(search, 'i') }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

module.exports = router;
