import { io, type Socket } from 'socket.io-client';
import type { DraftPick } from '../store/draftSlice';

interface ServerToClientEvents {
  picks: (picks: DraftPick[]) => void;
}

interface ClientToServerEvents {
  joinDraft: (payload: { draftId: string }) => void;
  leaveDraft: (payload: { draftId: string }) => void;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export function createDraftSocket(): Socket<ServerToClientEvents, ClientToServerEvents> {
  return io(`${SOCKET_URL}/drafts`, {
    autoConnect: false,
    forceNew: true,
  });
}
