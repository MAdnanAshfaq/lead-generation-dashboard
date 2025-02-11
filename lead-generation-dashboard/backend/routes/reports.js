const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { Document, Paragraph, Table, TableRow, TableCell, TextRun } = require('docx');
const Target = require('../models/Target');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Helper function to create the report document
const createReport = async (userData, targets, achievements) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Employee Performance Report',
                            bold: true,
                            size: 32
                        })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Employee: ${userData.firstName} ${userData.lastName}`,
                            size: 24
                        })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Period: ${targets[0]?.startDate.toLocaleDateString()} - ${targets[0]?.endDate.toLocaleDateString()}`,
                            size: 24
                        })
                    ]
                }),
                // Add target summary table
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph('Metric')] }),
                                new TableCell({ children: [new Paragraph('Target')] }),
                                new TableCell({ children: [new Paragraph('Achieved')] }),
                                new TableCell({ children: [new Paragraph('Completion Rate')] })
                            ]
                        }),
                        ...targets.map(target => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(target.type)] }),
                                new TableCell({ children: [new Paragraph(`${target.targets.jobsFetched + target.targets.jobsApplied}`)] }),
                                new TableCell({ children: [new Paragraph(`${target.achievements.jobsFetched + target.achievements.jobsApplied}`)] }),
                                new TableCell({ children: [new Paragraph(`${target.completionRate.toFixed(2)}%`)] })
                            ]
                        }))
                    ]
                }),
                // Add detailed achievements
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'Detailed Achievements',
                            bold: true,
                            size: 28
                        })
                    ]
                }),
                // Add achievements table
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph('Date')] }),
                                new TableCell({ children: [new Paragraph('Profile')] }),
                                new TableCell({ children: [new Paragraph('Jobs Fetched')] }),
                                new TableCell({ children: [new Paragraph('Jobs Applied')] })
                            ]
                        }),
                        ...achievements.map(achievement => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(achievement.date.toLocaleDateString())] }),
                                new TableCell({ children: [new Paragraph(achievement.profile.name)] }),
                                new TableCell({ children: [new Paragraph(`${achievement.metrics.jobsFetched}`)] }),
                                new TableCell({ children: [new Paragraph(`${achievement.metrics.jobsApplied}`)] })
                            ]
                        }))
                    ]
                })
            ]
        }]
    });

    return doc;
};

// @route   GET /api/reports/employee/:userId
// @desc    Generate employee report
// @access  Manager only
router.get('/employee/:userId', auth, authorize('manager'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const query = {
            assignedTo: userId
        };

        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const profiles = await Profile.find(query);
        const targets = await Target.find({ employeeId: userId });

        const report = {
            totalLeads: profiles.length,
            qualifiedLeads: profiles.filter(p => p.status === 'qualified').length,
            closedDeals: profiles.filter(p => p.status === 'closed').length,
            targets: targets.map(t => ({
                type: t.type,
                value: t.value,
                status: t.status,
                deadline: t.deadline
            }))
        };

        res.json(report);
    } catch (error) {
        console.error('Error generating employee report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/reports/team
// @desc    Get team performance report
// @access  Manager only
router.get('/team', auth, authorize('manager'), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const profiles = await Profile.find(query)
            .populate('assignedTo', 'email');

        const teamReport = profiles.reduce((acc, profile) => {
            const employeeEmail = profile.assignedTo.email;
            
            if (!acc[employeeEmail]) {
                acc[employeeEmail] = {
                    totalLeads: 0,
                    qualifiedLeads: 0,
                    closedDeals: 0
                };
            }

            acc[employeeEmail].totalLeads++;
            if (profile.status === 'qualified') {
                acc[employeeEmail].qualifiedLeads++;
            }
            if (profile.status === 'closed') {
                acc[employeeEmail].closedDeals++;
            }

            return acc;
        }, {});

        res.json(teamReport);
    } catch (error) {
        console.error('Error generating team report:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/reports/manager/summary
// @desc    Get report summary for manager
// @access  Manager only
router.get('/manager/summary', auth, authorize('manager'), async (req, res) => {
    try {
        const summary = {
            totalTargets: await Target.countDocuments(),
            totalAchievements: await Achievement.countDocuments()
        };
        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching report summary', error: error.message });
    }
});

module.exports = router;
