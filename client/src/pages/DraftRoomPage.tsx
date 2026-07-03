import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { fetchDraftPicks, type ConnectionStatus } from '../store/draftSlice';
import { useDraftSocket } from '../hooks/useDraftSocket';

const ROUNDS = 15;
const TEAMS = 10;

export default function DraftRoomPage() {
  const { draftId } = useParams<{ draftId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { picks, connectionStatus, loading, error } = useSelector((s: RootState) => s.draft);

  useEffect(() => {
    if (draftId) dispatch(fetchDraftPicks(draftId));
  }, [draftId, dispatch]);

  useDraftSocket(draftId);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left: Available Players */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 overflow-y-auto p-4">
        <h2 className="font-semibold mb-3">Available Players</h2>
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-white/5 animate-pulse" />
          ))}
        </div>
      </aside>

      {/* Center: Draft Board */}
      <main className="flex-1 overflow-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">Draft Board</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Draft {draftId?.slice(0, 8)}…</span>
            <ConnectionBadge status={connectionStatus} />
          </div>
        </div>

        <section className="mb-6">
          <h2 className="font-semibold mb-2 text-sm text-gray-400">Recent Picks</h2>
          {loading && <p className="text-sm text-gray-400">Loading picks…</p>}
          {error && (
            <div>
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={() => draftId && dispatch(fetchDraftPicks(draftId))}
                className="mt-1 underline text-xs"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && picks.length === 0 && (
            <p className="text-sm text-gray-500">No picks yet.</p>
          )}
          <div className="space-y-1">
            {[...picks].reverse().map((pick) => (
              <div
                key={pick.pickNumber}
                className="flex items-center justify-between text-sm p-2 rounded bg-white/5"
              >
                <span className="text-gray-400">
                  Pick {pick.pickNumber} · Rd {pick.round}
                </span>
                <span>{pick.pickedBy}</span>
                <span className="text-gray-500">{pick.sleeperPlayerId}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="overflow-x-auto">
          <table className="text-xs border-collapse w-full">
            <thead>
              <tr>
                <th className="p-1 text-left text-gray-400">Rd</th>
                {Array.from({ length: TEAMS }).map((_, i) => (
                  <th key={i} className="p-1 text-gray-400">
                    Team {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROUNDS }).map((_, r) => (
                <tr key={r}>
                  <td className="p-1 text-gray-500">{r + 1}</td>
                  {Array.from({ length: TEAMS }).map((_, t) => (
                    <td key={t} className="p-1">
                      <div className="h-8 w-24 rounded bg-white/5" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Right: Roster + AI Recommendations */}
      <aside className="w-56 flex-shrink-0 border-l border-white/10 p-4 overflow-y-auto space-y-6">
        <section>
          <h2 className="font-semibold mb-3">My Roster</h2>
          <div className="space-y-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-8 rounded bg-white/5 animate-pulse" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-semibold mb-3">AI Picks</h2>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-white/5 animate-pulse" />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const config: Record<ConnectionStatus, { label: string; className: string }> = {
    connecting: { label: 'Connecting…', className: 'bg-yellow-500/20 text-yellow-400' },
    connected: { label: 'Live', className: 'bg-green-500/20 text-green-400' },
    reconnecting: { label: 'Reconnecting…', className: 'bg-yellow-500/20 text-yellow-400' },
    disconnected: { label: 'Disconnected', className: 'bg-red-500/20 text-red-400' },
  };
  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
