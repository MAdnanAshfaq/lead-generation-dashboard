import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosConfig';

const initialState = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('token')
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            
            // Store in localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            
            // Clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { login, logout, setError, clearError } = authSlice.actions;

// Thunk for verifying token
export const verifyToken = () => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
            return false;
        }

        const response = await axiosInstance.get('/auth/verify');
        return true;
    } catch (error) {
        console.error('Token verification failed:', error);
        dispatch(logout());
        return false;
    }
};

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
