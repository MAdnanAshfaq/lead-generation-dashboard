import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle token expiration and errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
};

export const userAPI = {
    getUsers: () => api.get('/api/users'),
    updateUser: (id, data) => api.put(`/api/users/${id}`, data),
    deleteUser: (id) => api.delete(`/api/users/${id}`),
    getUserStats: (id, params) => api.get(`/api/users/${id}/stats`, { params }),
};

export const targetAPI = {
    createTarget: (data) => api.post('/api/targets', data),
    getEmployeeTargets: (userId, params) => api.get(`/api/targets/employee/${userId}`, { params }),
    updateAchievements: (targetId, data) => api.put(`/api/targets/${targetId}/achievements`, data),
    addDailyAchievement: (targetId, data) => api.post(`/api/targets/${targetId}/daily-achievement`, data),
    getStats: (params) => api.get('/targets/stats', { params }),
};

export const profileAPI = {
    getProfiles: () => api.get('/profiles'),
    createProfile: (data) => api.post('/api/profiles', data),
    updateProfile: (id, data) => api.put(`/api/profiles/${id}`, data),
    deleteProfile: (id) => api.delete(`/api/profiles/${id}`),
    assignProfiles: (data) => api.post('/api/profiles/assign', data),
    getProfileEmployees: (profileId) => api.get(`/users/employees/${profileId}`),
};

export const reportAPI = {
    generateReport: (userId, params) => api.get(`/api/reports/${userId}`, { params }),
};

export default api;
