import { createSlice } from '@reduxjs/toolkit';

interface League {
  league_id: string;
  name: string;
  season: string;
  total_rosters: number;
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

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {
    setLeagues(state, action) {
      state.leagues = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state) {
      state.loading = true;
      state.error = null;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLeagues, setLoading, setError } = leagueSlice.actions;
export default leagueSlice.reducer;
