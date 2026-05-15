import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  email: string | null;
  isSleeperLinked: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  email: localStorage.getItem('email'),
  isSleeperLinked: localStorage.getItem('isSleeperLinked') === 'true',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; email: string }>) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('email', action.payload.email);
    },
    setSleeperLinked(state) {
      state.isSleeperLinked = true;
      localStorage.setItem('isSleeperLinked', 'true');
    },
    logout(state) {
      state.token = null;
      state.email = null;
      state.isSleeperLinked = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('isSleeperLinked');
    },
  },
});

export const { setCredentials, setSleeperLinked, logout } = authSlice.actions;
export default authSlice.reducer;
