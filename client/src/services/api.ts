import axios from 'axios';
import type { League } from '../store/leagueSlice';
import type { DraftPick } from '../store/draftSlice';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login — posts credentials, gets back a token and email:
export async function login(email: string, password: string) {
  const res = await api.post<{
    token: string;
    email: string;
  }>('/auth/login', {
    email,
    password,
  });

  return res.data;
}

// Signup — same shape as login, different endpoint:
export async function signup(email: string, password: string) {
  const res = await api.post<{
    token: string;
    email: string;
  }>('/auth/signup', {
    email,
    password,
  });

  return res.data;
}

// LinkSleeper — only needs a username; the interceptor attaches the JWT automatically:
export async function linkSleeper(sleeperUsername: string) {
  await api.post('/auth/link-sleeper', { username: sleeperUsername });
}

export async function getLeagues(): Promise<League[]> {
  const res = await api.get<League[]>('/leagues');
  return res.data;
}

export async function getDraftPicks(draftId: string): Promise<DraftPick[]> {
  const res = await api.get<DraftPick[]>(`/drafts/${draftId}/picks`);
  return res.data;
}

export default api;
