import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Document, Paragraph, Table, TableRow, TableCell, Packer } from 'docx';

export const generateEmployeeReport = async (employeeData, startDate, endDate) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: 'Employee Performance Report',
                    heading: 'Title',
                }),
                new Paragraph({
                    text: `Report Period: ${format(new Date(startDate), 'PP')} to ${format(new Date(endDate), 'PP')}`,
                }),
                new Paragraph({
                    text: `Employee: ${employeeData.name}`,
                }),
                new Paragraph({
                    text: 'Daily Performance',
                    heading: 'Heading1',
                }),
                createPerformanceTable(employeeData.dailyStats),
                new Paragraph({
                    text: 'Profile-wise Performance',
                    heading: 'Heading1',
                }),
                createProfileTable(employeeData.profileStats),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `employee_report_${format(new Date(), 'yyyy-MM-dd')}.docx`);
};

const createPerformanceTable = (dailyStats) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({ text: 'Date' }),
                    new TableCell({ text: 'Jobs Fetched' }),
                    new TableCell({ text: 'Jobs Applied' }),
                    new TableCell({ text: 'Achievement %' }),
                ],
            }),
            ...dailyStats.map(stat => new TableRow({
                children: [
                    new TableCell({ text: format(new Date(stat.date), 'PP') }),
                    new TableCell({ text: stat.jobsFetched.toString() }),
                    new TableCell({ text: stat.jobsApplied.toString() }),
                    new TableCell({ text: `${stat.achievementPercentage}%` }),
                ],
            })),
        ],
    });
};

const createProfileTable = (profileStats) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({ text: 'Profile' }),
                    new TableCell({ text: 'Total Jobs Fetched' }),
                    new TableCell({ text: 'Total Jobs Applied' }),
                    new TableCell({ text: 'Success Rate' }),
                ],
            }),
            ...profileStats.map(stat => new TableRow({
                children: [
                    new TableCell({ text: stat.profileName }),
                    new TableCell({ text: stat.totalJobsFetched.toString() }),
                    new TableCell({ text: stat.totalJobsApplied.toString() }),
                    new TableCell({ text: `${stat.successRate}%` }),
                ],
            })),
        ],
    });
};

export const generateTeamReport = async (teamData, startDate, endDate) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: 'Team Performance Report',
                    heading: 'Title',
                }),
                new Paragraph({
                    text: `Report Period: ${format(new Date(startDate), 'PP')} to ${format(new Date(endDate), 'PP')}`,
                }),
                new Paragraph({
                    text: 'Team Overview',
                    heading: 'Heading1',
                }),
                createTeamSummaryTable(teamData.summary),
                new Paragraph({
                    text: 'Employee Performance',
                    heading: 'Heading1',
                }),
                createEmployeeComparisonTable(teamData.employeeStats),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `team_report_${format(new Date(), 'yyyy-MM-dd')}.docx`);
};

const createTeamSummaryTable = (summary) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({ text: 'Metric' }),
                    new TableCell({ text: 'Value' }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ text: 'Total Jobs Fetched' }),
                    new TableCell({ text: summary.totalJobsFetched.toString() }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ text: 'Total Jobs Applied' }),
                    new TableCell({ text: summary.totalJobsApplied.toString() }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ text: 'Average Success Rate' }),
                    new TableCell({ text: `${summary.averageSuccessRate}%` }),
                ],
            }),
        ],
    });
};

const createEmployeeComparisonTable = (employeeStats) => {
    return new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({ text: 'Employee' }),
                    new TableCell({ text: 'Jobs Fetched' }),
                    new TableCell({ text: 'Jobs Applied' }),
                    new TableCell({ text: 'Success Rate' }),
                    new TableCell({ text: 'Target Achievement' }),
                ],
            }),
            ...employeeStats.map(stat => new TableRow({
                children: [
                    new TableCell({ text: stat.employeeName }),
                    new TableCell({ text: stat.jobsFetched.toString() }),
                    new TableCell({ text: stat.jobsApplied.toString() }),
                    new TableCell({ text: `${stat.successRate}%` }),
                    new TableCell({ text: `${stat.targetAchievement}%` }),
                ],
            })),
        ],
    });
};
