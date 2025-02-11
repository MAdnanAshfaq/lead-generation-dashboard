import axiosInstance from '../utils/axiosConfig';

const dashboardService = {
    getManagerStats: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/manager/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching manager stats:', error);
            throw error;
        }
    },

    testProfiles: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/test/profiles');
            return response.data;
        } catch (error) {
            console.error('Error testing profiles:', error);
            throw error;
        }
    }
};

export default dashboardService; 