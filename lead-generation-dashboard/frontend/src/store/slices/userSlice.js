import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API calls - replace with actual API calls
const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'MANAGER',
        status: 'ACTIVE',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'EMPLOYEE',
        status: 'ACTIVE',
    },
];

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockUsers), 1000);
        });
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData) => {
        // Simulate API call
        return new Promise((resolve) => {
            const newUser = {
                id: Date.now(),
                ...userData,
                status: 'ACTIVE',
            };
            setTimeout(() => resolve(newUser), 1000);
        });
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, userData }) => {
        // Simulate API call
        return new Promise((resolve) => {
            const updatedUser = { id, ...userData };
            setTimeout(() => resolve(updatedUser), 1000);
        });
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id) => {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(id), 1000);
        });
    }
);

const initialState = {
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedUser, clearSelectedUser } = userSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectUserLoading = (state) => state.users.loading;
export const selectUserError = (state) => state.users.error;
export const selectSelectedUser = (state) => state.users.selectedUser;

export default userSlice.reducer;
