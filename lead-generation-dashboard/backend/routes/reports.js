const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { Document, Paragraph, Table, TableRow, TableCell, TextRun } = require('docx');
const Target = require('../models/Target');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

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
router.get('/employee/:userId', protect, authorize('manager'), async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        // Verify the employee belongs to the manager
        const employee = await User.findOne({
            _id: userId,
            manager: req.user.id
        });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found or not authorized' });
        }

        // Fetch targets and achievements
        const targets = await Target.find({
            userId,
            startDate: { $gte: new Date(startDate) },
            endDate: { $lte: new Date(endDate) }
        }).populate('profileWiseData.profile');

        const achievements = await Achievement.find({
            userId,
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).populate('profile');

        // Generate report
        const doc = await createReport(employee, targets, achievements);

        // Set headers for file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename=${employee.username}_report.docx`);

        // Generate document buffer and send
        const buffer = await doc.save();
        res.send(buffer);

    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
});

// @route   GET /api/reports/manager/summary
// @desc    Get report summary for manager
// @access  Manager only
router.get('/manager/summary', protect, authorize('manager'), async (req, res) => {
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
