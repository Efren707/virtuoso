import { createSlice } from '@reduxjs/toolkit';

interface DraftState {
  picks: unknown[];
  availablePlayers: unknown[];
  myRoster: unknown[];
}

const initialState: DraftState = {
  picks: [],
  availablePlayers: [],
  myRoster: [],
};

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {},
});

export default draftSlice.reducer;
