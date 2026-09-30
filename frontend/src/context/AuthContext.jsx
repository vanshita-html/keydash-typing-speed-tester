import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('keydash_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('keydash_token'));
  const [personalBests, setPersonalBests] = useState(() => {
    const saved = localStorage.getItem('keydash_pbs');
    return saved ? JSON.parse(saved) : {};
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('keydash_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('keydash_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = async (username, password) => {
    const data = await api.login(username, password);
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('keydash_user', JSON.stringify(data.user));
    localStorage.setItem('keydash_token', data.access_token);

    // Fetch user stats to sync remote personal bests
    try {
      const stats = await api.getMyStats();
      if (stats && stats.mode_bests) {
        setPersonalBests((prev) => {
          const merged = { ...prev, ...stats.mode_bests };
          localStorage.setItem('keydash_pbs', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      console.warn('Could not sync remote stats', e);
    }
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('keydash_user');
    localStorage.removeItem('keydash_token');
  };

  const updatePersonalBest = (mode, wpm) => {
    setPersonalBests((prev) => {
      const currentBest = prev[mode] || 0;
      if (wpm > currentBest) {
        const updated = { ...prev, [mode]: wpm };
        localStorage.setItem('keydash_pbs', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const getBestForMode = (mode) => {
    return personalBests[mode] || 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        personalBests,
        updatePersonalBest,
        getBestForMode,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
