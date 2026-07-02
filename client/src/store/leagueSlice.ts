import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLeagues } from '../services/api';

export interface League {
  id: string;
  sleeperId: string;
  name: string;
  season: string;
  status: string;
  scoringType: 'ppr' | 'half_ppr' | 'standard';
  totalRosters: number;
  draftId: string | null;
}

interface LeagueState {
  leagues: League[];
  loading: boolean;
  error: string | null;
}

const initialState: LeagueState = {
  leagues: [],
  loading: false,
  error: null,
};

export const fetchLeagues = createAsyncThunk('league/fetchLeagues', async () => {
  return await getLeagues();
});

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeagues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeagues.fulfilled, (state, action) => {
        state.loading = false;
        state.leagues = action.payload;
      })
      .addCase(fetchLeagues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load leagues';
      });
  },
});

export default leagueSlice.reducer;
