import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  email: string | null;
  isSleeperLinked: boolean;
}

const initialState: AuthState = {
  token: null,
  email: null,
  isSleeperLinked: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; email: string }>) {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    setSleeperLinked(state) {
      state.isSleeperLinked = true;
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.isSleeperLinked = false;
    },
  },
});

export const { setCredentials, setSleeperLinked, logout } = authSlice.actions;
export default authSlice.reducer;
