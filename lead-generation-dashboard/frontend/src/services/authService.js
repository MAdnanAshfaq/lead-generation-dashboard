import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

let loginRequest = null;

const authService = {
    login: async (credentials) => {
        try {
            // If there's already a login request in progress, return it
            if (loginRequest) {
                return loginRequest;
            }

            // Create new login request
            loginRequest = axios.post(`${API_URL}/login`, credentials)
                .then(response => {
                    console.log('Login response:', response.data);
                    if (response.data.token) {
                        localStorage.setItem('token', response.data.token);
                    }
                    return response.data;
                })
                .catch(error => {
                    console.error('Login error:', error.response?.data || error.message);
                    throw error;
                })
                .finally(() => {
                    loginRequest = null; // Clear the request
                });

            return loginRequest;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default authService; 