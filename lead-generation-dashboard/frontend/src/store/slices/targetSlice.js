import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { targetAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const fetchEmployeeTargets = createAsyncThunk(
    'targets/fetchEmployeeTargets',
    async ({ userId, startDate, endDate, type }) => {
        const response = await targetAPI.getEmployeeTargets(userId, { startDate, endDate, type });
        return response.data;
    }
);

export const updateAchievements = createAsyncThunk(
    'targets/updateAchievements',
    async ({ targetId, achievements, profileWiseData }) => {
        const response = await targetAPI.updateAchievements(targetId, { achievements, profileWiseData });
        return response.data;
    }
);

export const addDailyAchievement = createAsyncThunk(
    'targets/addDailyAchievement',
    async ({ targetId, data }) => {
        const response = await targetAPI.addDailyAchievement(targetId, data);
        return response.data;
    }
);

export const fetchTargetStats = createAsyncThunk(
    'targets/fetchStats',
    async ({ startDate, endDate, userId, type }) => {
        const response = await targetAPI.getStats({ startDate, endDate, userId, type });
        return response.data;
    }
);

const initialState = {
    targets: [],
    achievements: [],
    stats: null,
    loading: false,
    error: null,
};

const targetSlice = createSlice({
    name: 'targets',
    initialState,
    reducers: {
        clearTargets: (state) => {
            state.targets = [];
            state.achievements = [];
            state.stats = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Employee Targets
            .addCase(fetchEmployeeTargets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployeeTargets.fulfilled, (state, action) => {
                state.loading = false;
                state.targets = action.payload;
            })
            .addCase(fetchEmployeeTargets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error('Failed to fetch targets');
            })

            // Update Achievements
            .addCase(updateAchievements.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAchievements.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTarget = action.payload;
                state.targets = state.targets.map(target =>
                    target._id === updatedTarget._id ? updatedTarget : target
                );
                toast.success('Achievements updated successfully');
            })
            .addCase(updateAchievements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error('Failed to update achievements');
            })

            // Add Daily Achievement
            .addCase(addDailyAchievement.pending, (state) => {
                state.loading = true;
            })
            .addCase(addDailyAchievement.fulfilled, (state, action) => {
                state.loading = false;
                state.achievements.push(action.payload);
                toast.success('Achievement added successfully');
            })
            .addCase(addDailyAchievement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error('Failed to add achievement');
            })

            // Fetch Stats
            .addCase(fetchTargetStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTargetStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload;
            })
            .addCase(fetchTargetStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error('Failed to fetch stats');
            });
    },
});

export const { clearTargets } = targetSlice.actions;

export const selectTargets = (state) => state.targets.targets;
export const selectAchievements = (state) => state.targets.achievements;
export const selectStats = (state) => state.targets.stats;
export const selectTargetLoading = (state) => state.targets.loading;
export const selectTargetError = (state) => state.targets.error;

export default targetSlice.reducer;
