import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API calls - replace with actual API calls
const mockProfiles = [
    {
        id: 1,
        userId: 1,
        department: 'Sales',
        position: 'Team Lead',
        location: 'New York',
        joinDate: '2024-01-01',
        status: 'ACTIVE',
    },
    {
        id: 2,
        userId: 2,
        department: 'Marketing',
        position: 'Associate',
        location: 'Los Angeles',
        joinDate: '2024-01-02',
        status: 'ACTIVE',
    },
];

export const fetchProfiles = createAsyncThunk(
    'profiles/fetchProfiles',
    async () => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockProfiles), 1000);
        });
    }
);

export const createProfile = createAsyncThunk(
    'profiles/createProfile',
    async (profileData) => {
        // Simulate API call
        return new Promise((resolve) => {
            const newProfile = {
                id: Date.now(),
                ...profileData,
                status: 'ACTIVE',
            };
            setTimeout(() => resolve(newProfile), 1000);
        });
    }
);

export const updateProfile = createAsyncThunk(
    'profiles/updateProfile',
    async ({ id, profileData }) => {
        // Simulate API call
        return new Promise((resolve) => {
            const updatedProfile = { id, ...profileData };
            setTimeout(() => resolve(updatedProfile), 1000);
        });
    }
);

export const deleteProfile = createAsyncThunk(
    'profiles/deleteProfile',
    async (id) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(id), 1000);
        });
    }
);

const initialState = {
    profiles: [],
    loading: false,
    error: null,
    selectedProfile: null,
};

const profileSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        setSelectedProfile: (state, action) => {
            state.selectedProfile = action.payload;
        },
        clearSelectedProfile: (state) => {
            state.selectedProfile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Profiles
            .addCase(fetchProfiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = action.payload;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create Profile
            .addCase(createProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles.push(action.payload);
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.profiles.findIndex(profile => profile.id === action.payload.id);
                if (index !== -1) {
                    state.profiles[index] = action.payload;
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete Profile
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = state.profiles.filter(profile => profile.id !== action.payload);
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedProfile, clearSelectedProfile } = profileSlice.actions;

export const selectProfiles = (state) => state.profiles.profiles;
export const selectProfileLoading = (state) => state.profiles.loading;
export const selectProfileError = (state) => state.profiles.error;
export const selectSelectedProfile = (state) => state.profiles.selectedProfile;

export default profileSlice.reducer;
