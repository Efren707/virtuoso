import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { login } from '../services/api';
import type { RootState } from '../store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSleeperLinked = useSelector((state: RootState) => state.auth.isSleeperLinked);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      dispatch(setCredentials({ token: data.token, email: data.email }));
      navigate(isSleeperLinked ? '/dashboard' : '/link-sleeper');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Login failed';
      setError(typeof message === 'string' ? message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in</h1>

      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
