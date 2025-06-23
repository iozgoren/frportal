// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock authentication service
const mockAuthService = {
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, hardcoded user credentials
    if (
      (credentials.username === 'admin' && credentials.password === 'password') ||
      (credentials.username === 'user' && credentials.password === 'password')
    ) {
      const isAdmin = credentials.username === 'admin';
      return {
        id: isAdmin ? '1' : '2',
        username: credentials.username,
        name: isAdmin ? 'Admin User' : 'Regular User',
        email: isAdmin ? 'admin@example.com' : 'user@example.com',
        role: isAdmin ? 'Admin' : 'User',
        avatarUrl: `https://placehold.co/200x200/${isAdmin ? '4F46E5' : '10B981'}/FFFFFF?text=${credentials.username.charAt(0).toUpperCase()}`,
        permissions: isAdmin ? ['admin', 'user'] : ['user'],
        preferences: {
          theme: 'light',
          notifications: true
        }
      };
    }
    
    throw new Error('Invalid username or password');
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await mockAuthService.login(credentials);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await mockAuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = `mock-jwt-token-${Date.now()}`;
        state.isAuthenticated = true;
        // In a real app, store token in localStorage
        localStorage.setItem('token', state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Authentication failed';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        // In a real app, remove token from localStorage
        localStorage.removeItem('token');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  }
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;