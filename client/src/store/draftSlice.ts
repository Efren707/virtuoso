import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { getDraftPicks } from '../services/api';

export interface DraftPick {
  draftId: string;
  round: number;
  pickNumber: number;
  pickedBy: string;
  sleeperPlayerId: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface DraftState {
  picks: DraftPick[];
  availablePlayers: unknown[];
  myRoster: unknown[];
  connectionStatus: ConnectionStatus;
  loading: boolean;
  error: string | null;
}

const initialState: DraftState = {
  picks: [],
  availablePlayers: [],
  myRoster: [],
  connectionStatus: 'disconnected',
  loading: false,
  error: null,
};

export const fetchDraftPicks = createAsyncThunk(
  'draft/fetchDraftPicks',
  async (draftId: string) => {
    return await getDraftPicks(draftId);
  },
);

const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    pickReceived(state, action: PayloadAction<DraftPick[]>) {
      const seen = new Set(state.picks.map((p) => p.pickNumber));
      for (const pick of action.payload) {
        if (!seen.has(pick.pickNumber)) {
          state.picks.push(pick);
          seen.add(pick.pickNumber);
        }
      }
      state.picks.sort((a, b) => a.pickNumber - b.pickNumber);
    },
    connectionStatusChanged(state, action: PayloadAction<ConnectionStatus>) {
      state.connectionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDraftPicks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDraftPicks.fulfilled, (state, action) => {
        state.loading = false;
        state.picks = action.payload;
      })
      .addCase(fetchDraftPicks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load draft picks';
      });
  },
});

export const { pickReceived, connectionStatusChanged } = draftSlice.actions;
export default draftSlice.reducer;
