import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    loadingCount: 0,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.loadingCount += 1;
            state.loading = true;
        },
        stopLoading: (state) => {
            state.loadingCount = Math.max(0, state.loadingCount - 1);
            state.loading = state.loadingCount > 0;
        },
        resetLoading: (state) => {
            state.loadingCount = 0;
            state.loading = false;
        },
    },
});

export const { startLoading, stopLoading, resetLoading } = uiSlice.actions;

export const selectLoading = (state) => state.ui.loading;

export default uiSlice.reducer;
