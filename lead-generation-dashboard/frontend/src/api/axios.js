import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 5000  // 5 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.data);
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        return Promise.reject(error);
    }
);

export default api;