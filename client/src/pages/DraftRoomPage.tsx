import { useParams } from 'react-router-dom';

const ROUNDS = 15;
const TEAMS = 10;

export default function DraftRoomPage() {
  const { id } = useParams<{ id: string }>();

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
          <span className="text-sm text-gray-400">League {id?.slice(0, 8)}…</span>
        </div>
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
