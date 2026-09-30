import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, User as UserIcon, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RankBadge } from '../components/RankBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const LEADERBOARD_MODES = [
  { id: 'time_30', label: '⏱️ Time 30s' },
  { id: 'time_60', label: '⏱️ Time 60s' },
  { id: 'time_15', label: '⚡ Time 15s' },
  { id: 'time_120', label: '⏳ Time 120s' },
  { id: 'words_25', label: '📝 25 Words' },
  { id: 'words_50', label: '📝 50 Words' },
  { id: 'words_10', label: '📝 10 Words' },
];

export function LeaderboardPage() {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState('time_30');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getLeaderboard(selectedMode, 10)
      .then((data) => setLeaderboard(data))
      .catch((err) => {
        console.error('Leaderboard error:', err);
        setError('Failed to load leaderboard rankings.');
      })
      .finally(() => setLoading(false));
  }, [selectedMode]);

  const getMedal = (rank) => {
    if (rank === 1) return <span style={{ fontSize: '1.4rem' }}>🥇</span>;
    if (rank === 2) return <span style={{ fontSize: '1.4rem' }}>🥈</span>;
    if (rank === 3) return <span style={{ fontSize: '1.4rem' }}>🥉</span>;
    return <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>#{rank}</span>;
  };

  return (
    <div
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '36px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Title & Description */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Trophy size={32} color="var(--accent-yellow-dark)" />
          <h1 style={{ fontSize: '2.4rem' }}>Global Leaderboards</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto' }}>
          Compare top typing speeds with speed typists worldwide. One best score per user per mode.
        </p>
      </div>

      {/* Mode Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '4px' }}>
        <div className="mode-group" role="tablist">
          {LEADERBOARD_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`mode-pill ${selectedMode === m.id ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 Cards Preview (if loaded) */}
      {!loading && leaderboard.length >= 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            margin: '8px 0',
          }}
        >
          {/* Rank 2 (Silver) */}
          <div
            className="card"
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              order: 1,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🥈</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{leaderboard[1].username}</h3>
            <div
              style={{
                fontSize: '2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-lavender-hover)',
              }}
            >
              {leaderboard[1].wpm} <span style={{ fontSize: '0.9rem' }}>WPM</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {leaderboard[1].accuracy}% acc • {leaderboard[1].consistency}% cons
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div
            className="card"
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'var(--accent-yellow-subtle)',
              border: '2px solid var(--accent-yellow-dark)',
              order: 0,
              transform: 'scale(1.04)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🥇</div>
            <span className="sticker-badge" style={{ marginBottom: '8px' }}>
              <Crown size={14} /> Champion
            </span>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{leaderboard[0].username}</h3>
            <div
              style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-coral)',
              }}
            >
              {leaderboard[0].wpm} <span style={{ fontSize: '1rem' }}>WPM</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {leaderboard[0].accuracy}% acc • {leaderboard[0].consistency}% cons
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div
            className="card"
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              order: 2,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🥉</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{leaderboard[2].username}</h3>
            <div
              style={{
                fontSize: '2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-mint)',
              }}
            >
              {leaderboard[2].wpm} <span style={{ fontSize: '0.9rem' }}>WPM</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {leaderboard[2].accuracy}% acc • {leaderboard[2].consistency}% cons
            </div>
          </div>
        </div>
      )}

      {/* Main Leaderboard Table */}
      <div className="card" style={{ padding: '28px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
            <LoadingSkeleton height="50px" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--color-wrong)', padding: '20px' }}>
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No scores registered for this mode yet. Be the first to rank!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <th style={{ padding: '12px 14px' }}>RANK</th>
                <th style={{ padding: '12px 14px' }}>USER</th>
                <th style={{ padding: '12px 14px' }}>WPM</th>
                <th style={{ padding: '12px 14px' }}>RAW</th>
                <th style={{ padding: '12px 14px' }}>ACCURACY</th>
                <th style={{ padding: '12px 14px' }}>CONSISTENCY</th>
                <th style={{ padding: '12px 14px' }}>BADGE</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                const isCurrentUser = user && user.username === entry.username;
                return (
                  <tr
                    key={entry.rank}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isCurrentUser ? 'var(--accent-coral-subtle)' : 'transparent',
                      transition: 'background-color 0.15s',
                      fontWeight: isCurrentUser ? 600 : 400,
                    }}
                  >
                    <td style={{ padding: '14px 14px', width: '60px' }}>
                      {getMedal(entry.rank)}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>{entry.username}</span>
                        {isCurrentUser && (
                          <span
                            className="sticker-badge sticker-badge-coral"
                            style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                          >
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '14px 14px',
                        fontSize: '1.2rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        color: 'var(--accent-coral)',
                      }}
                    >
                      {entry.wpm}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--text-secondary)' }}>
                      {entry.raw_wpm}
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--accent-mint)', fontWeight: 600 }}>
                      {entry.accuracy}%
                    </td>
                    <td style={{ padding: '14px 14px', color: 'var(--text-secondary)' }}>
                      {entry.consistency}%
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <RankBadge wpm={entry.wpm} size="sm" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
