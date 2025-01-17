import axios from 'axios';

class ActivityLogger {
    constructor() {
        this.activities = [];
        this.pending = [];
        this.isProcessing = false;
    }

    async logActivity(activity) {
        const logEntry = {
            ...activity,
            timestamp: new Date().toISOString(),
            userId: activity.userId || localStorage.getItem('userId'),
            userRole: activity.userRole || localStorage.getItem('userRole'),
            ipAddress: await this.getIpAddress(),
        };

        this.activities.push(logEntry);
        this.pending.push(logEntry);

        if (!this.isProcessing) {
            this.processPendingLogs();
        }
    }

    async getIpAddress() {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error('Failed to get IP address:', error);
            return 'unknown';
        }
    }

    async processPendingLogs() {
        if (this.pending.length === 0 || this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        try {
            const currentBatch = this.pending.slice(0, 10);
            await axios.post('/api/logs/batch', {
                logs: currentBatch,
            });

            this.pending = this.pending.slice(10);

            if (this.pending.length > 0) {
                setTimeout(() => this.processPendingLogs(), 1000);
            } else {
                this.isProcessing = false;
            }
        } catch (error) {
            console.error('Failed to process logs:', error);
            this.isProcessing = false;
            setTimeout(() => this.processPendingLogs(), 5000);
        }
    }

    async getActivityLogs(filters = {}) {
        try {
            const response = await axios.get('/api/logs', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch activity logs:', error);
            throw error;
        }
    }

    async getUserActivities(userId, startDate, endDate) {
        try {
            const response = await axios.get(`/api/logs/user/${userId}`, {
                params: { startDate, endDate },
            });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user activities:', error);
            throw error;
        }
    }
}

export const activityLogger = new ActivityLogger();

// Activity Types
export const ActivityType = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_USER: 'CREATE_USER',
    UPDATE_USER: 'UPDATE_USER',
    DELETE_USER: 'DELETE_USER',
    CREATE_TARGET: 'CREATE_TARGET',
    UPDATE_TARGET: 'UPDATE_TARGET',
    DELETE_TARGET: 'DELETE_TARGET',
    UPDATE_ACHIEVEMENT: 'UPDATE_ACHIEVEMENT',
    GENERATE_REPORT: 'GENERATE_REPORT',
};

// Log Activity Helper Functions
export const logUserActivity = async (type, details) => {
    await activityLogger.logActivity({
        type,
        details,
        source: window.location.pathname,
    });
};

export const logError = async (error, context) => {
    await activityLogger.logActivity({
        type: 'ERROR',
        details: {
            message: error.message,
            stack: error.stack,
            context,
        },
        source: window.location.pathname,
    });
};
