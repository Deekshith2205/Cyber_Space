import axios from 'axios';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  avatarInitials: string;
  clearanceLevel: number;
}

interface UserState {
  profile: UserProfile;
  loading: boolean;
  error: string | null;
}

export const saveProfileToServer = createAsyncThunk(
  'user/saveProfile',
  async (profile: Partial<UserProfile>) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await axios.put('/api/user/update', profile, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.user;
  }
);

const getInitialProfile = (): UserProfile => {
  const defaultProfile: UserProfile = {
    _id: "",
    name: "",
    email: "",
    role: "Analyst",
    designation: "Security Analyst",
    avatarInitials: "",
    clearanceLevel: 0,
  };

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cyberspace_analyst_profile');
    if (saved && saved !== "undefined") {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
  }
  return defaultProfile;
};

const initialState: UserState = {
  profile: getInitialProfile(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      
      // Automatically update initials if name changed
      if (action.payload.name) {
        const names = action.payload.name.trim().split(/\s+/);
        if (names.length >= 2) {
          state.profile.avatarInitials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
        } else if (names.length === 1 && names[0].length > 0) {
          state.profile.avatarInitials = names[0][0].toUpperCase();
        }
      }
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cyberspace_analyst_profile', JSON.stringify(state.profile));
      }
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProfileToServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProfileToServer.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('cyberspace_analyst_profile', JSON.stringify(state.profile));
        }
      })
      .addCase(saveProfileToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save profile';
      });
  },
});

export const { updateProfile, setProfile, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
