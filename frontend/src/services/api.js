const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const getHeaders = () => {
  const token = localStorage.getItem('keydash_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async login(username, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to sign in' }));
      throw new Error(err.detail || 'Invalid login credentials');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Texts
  async getText(category = 'easy', difficulty = 'medium', mode = 'time_30') {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (mode) params.append('mode', mode);

    const res = await fetch(`${API_BASE}/api/texts?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load practice text');
    return res.json();
  },

  // Results
  async saveResult(resultData) {
    const res = await fetch(`${API_BASE}/api/results`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resultData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to save score' }));
      throw new Error(err.detail || 'Error saving result');
    }
    return res.json();
  },

  async getMyResults(limit = 50, mode = null) {
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (mode) params.append('mode', mode);

    const res = await fetch(`${API_BASE}/api/results/me?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch results history');
    return res.json();
  },

  // Stats
  async getMyStats() {
    const res = await fetch(`${API_BASE}/api/stats/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user statistics');
    return res.json();
  },

  // Leaderboard
  async getLeaderboard(mode = 'time_30', limit = 10) {
    const params = new URLSearchParams();
    if (mode) params.append('mode', mode);
    params.append('limit', limit);

    const res = await fetch(`${API_BASE}/api/leaderboard?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to load leaderboard');
    return res.json();
  },
};
