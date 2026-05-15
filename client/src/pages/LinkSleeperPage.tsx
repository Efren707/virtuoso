import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSleeperLinked } from '../store/authSlice';
import { linkSleeper } from '../services/api';

export default function LinkSleeperPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await linkSleeper(username);
      dispatch(setSleeperLinked());
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Could not link Sleeper account';
      setError(typeof message === 'string' ? message : 'Could not link Sleeper account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Link your Sleeper account</h1>

      <p>Enter your Sleeper username to connect your account.</p>

      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <input
          type="text"
          placeholder="Sleeper username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Linking…' : 'Link account'}
        </button>
      </form>
    </div>
  );
}
