import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import leagueReducer from './leagueSlice';
import draftReducer from './draftSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    league: leagueReducer,
    draft: draftReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
