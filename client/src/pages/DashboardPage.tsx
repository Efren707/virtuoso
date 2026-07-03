import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLeagues } from '../store/leagueSlice';
import type { AppDispatch, RootState } from '../store';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { leagues, loading, error } = useSelector((s: RootState) => s.league);

  useEffect(() => {
    dispatch(fetchLeagues());
  }, [dispatch]);

  if (loading) {
    return <div className="p-8 text-gray-400">Loading your leagues...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">{error}</p>
        <button onClick={() => dispatch(fetchLeagues())} className="mt-2 underline text-sm">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Your Leagues</h1>
      {leagues.length === 0 ? (
        <p className="text-gray-400">No leagues found for this season.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) =>
            league.draftId ? (
              <Link
                key={league.id}
                to={`/draft/${league.draftId}`}
                className="block p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              >
                <p className="font-semibold text-lg">{league.name}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {league.season} · {league.totalRosters} teams · {scoringLabel(league.scoringType)}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{league.status}</p>
              </Link>
            ) : (
              <div
                key={league.id}
                className="block p-5 rounded-xl border border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
              >
                <p className="font-semibold text-lg">{league.name}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {league.season} · {league.totalRosters} teams · {scoringLabel(league.scoringType)}
                </p>
                <p className="text-xs text-gray-500 mt-1">No draft yet</p>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function scoringLabel(type: string): string {
  if (type === 'ppr') return 'PPR';
  if (type === 'half_ppr') return 'Half PPR';
  return 'Standard';
}
