import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { createDraftSocket } from '../services/socket';
import { pickReceived, connectionStatusChanged } from '../store/draftSlice';

export function useDraftSocket(draftId: string | undefined): void {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!draftId) return;

    const socket = createDraftSocket();

    socket.on('connect', () => {
      dispatch(connectionStatusChanged('connected'));
      socket.emit('joinDraft', { draftId });
    });

    socket.on('disconnect', (reason) => {
      dispatch(
        connectionStatusChanged(
          reason === 'io client disconnect' ? 'disconnected' : 'reconnecting',
        ),
      );
    });

    socket.on('picks', (picks) => {
      dispatch(pickReceived(picks));
    });

    dispatch(connectionStatusChanged('connecting'));
    socket.connect();

    return () => {
      socket.emit('leaveDraft', { draftId });
      socket.disconnect();
    };
  }, [draftId, dispatch]);
}
