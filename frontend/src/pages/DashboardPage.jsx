import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Zap,
  Target,
  Flame,
  Activity,
  History,
  TrendingUp,
  LogIn,
  Calendar,
  Clock,
  Award,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { RankBadge } from '../components/RankBadge';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([api.getMyStats(), api.getMyResults(50)])
      .then(([statsData, resultsData]) => {
        setStats(statsData);
        setResults(resultsData);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
        setError('Could not load your statistics. Please ensure you are logged in.');
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          maxWidth: '800px',
          margin: '40px auto',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div className="card" style={{ padding: '48px 32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--accent-coral-subtle)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <LockIcon color="var(--accent-coral)" />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Sign in to View Your Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 28px' }}>
            Track your typing speed progression over time, view detailed test analytics, unlock badges, and preserve your daily practice streaks!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              className="keycap-btn keycap-btn-primary keycap-btn-lg"
            >
              <LogIn size={18} /> Sign In With Demo Account
            </button>
            <Link to="/" className="keycap-btn keycap-btn-lg">
              Take a Guest Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format progression chart data (reverse so oldest is left, newest right)
  const chartData = [...results]
    .reverse()
    .slice(-25)
    .map((r, idx) => ({
      index: `#${idx + 1}`,
      wpm: r.wpm,
      accuracy: r.accuracy,
      date: new Date(r.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }));

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '36px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem' }}>Typing Dashboard</h1>
            <span className="sticker-badge sticker-badge-coral">
              @{user.username}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review your typing speed milestones, accuracy streaks, and test history.
          </p>
        </div>

        <Link to="/" className="keycap-btn keycap-btn-primary">
          <Zap size={16} /> Start New Test
        </Link>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LoadingSkeleton height="120px" />
          <LoadingSkeleton height="300px" />
        </div>
      ) : error ? (
        <div className="card" style={{ color: 'var(--color-wrong)' }}>
          {error}
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '18px',
            }}
          >
            {/* Best WPM */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  BEST WPM
                </span>
                <Trophy size={20} color="var(--accent-yellow-dark)" />
              </div>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-coral)',
                  lineHeight: 1.1,
                  marginTop: '8px',
                }}
              >
                {stats?.best_wpm || 0}
              </div>
              <div style={{ marginTop: '6px' }}>
                <RankBadge wpm={stats?.best_wpm || 0} size="sm" />
              </div>
            </div>

            {/* Average WPM */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  AVERAGE WPM
                </span>
                <TrendingUp size={20} color="var(--accent-lavender-hover)" />
              </div>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-lavender-hover)',
                  lineHeight: 1.1,
                  marginTop: '8px',
                }}
              >
                {stats?.avg_wpm || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Across {stats?.total_tests || 0} tests
              </div>
            </div>

            {/* Average Accuracy */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  AVG ACCURACY
                </span>
                <Target size={20} color="var(--accent-mint)" />
              </div>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-mint)',
                  lineHeight: 1.1,
                  marginTop: '8px',
                }}
              >
                {stats?.avg_accuracy || 0}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Precision rating
              </div>
            </div>

            {/* Streak & Tests */}
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  DAY STREAK
                </span>
                <Flame size={20} color="var(--accent-coral)" />
              </div>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--accent-coral)',
                  lineHeight: 1.1,
                  marginTop: '8px',
                }}
              >
                {stats?.streak_days || 1} 🔥
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {stats?.tests_this_week || 0} tests completed this week
              </div>
            </div>
          </div>

          {/* Speed & Accuracy Progress Charts */}
          <div className="card" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>
              📈 WPM Progression History (Last 25 Tests)
            </h3>
            {chartData.length > 0 ? (
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="index" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-color)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      name="WPM"
                      stroke="var(--accent-coral)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: 'var(--accent-coral)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      name="Accuracy %"
                      stroke="var(--accent-mint)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No completed test history yet. Take your first test now!
              </div>
            )}
          </div>

          {/* Recent Tests Table */}
          <div className="card" style={{ padding: '26px', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>🕒 Recent Tests History</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Showing last {results.length} tests
              </span>
            </div>

            {results.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <th style={{ padding: '10px 14px' }}>MODE</th>
                    <th style={{ padding: '10px 14px' }}>WPM</th>
                    <th style={{ padding: '10px 14px' }}>RAW</th>
                    <th style={{ padding: '10px 14px' }}>ACCURACY</th>
                    <th style={{ padding: '10px 14px' }}>ERRORS</th>
                    <th style={{ padding: '10px 14px' }}>RANK</th>
                    <th style={{ padding: '10px 14px' }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.92rem',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                        <span className="mode-pill" style={{ padding: '3px 8px', fontSize: '0.78rem' }}>
                          {r.mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-coral)' }}>
                        {r.wpm}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {r.raw_wpm}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--accent-mint)' }}>
                        {r.accuracy}%
                      </td>
                      <td style={{ padding: '12px 14px', color: r.errors > 0 ? 'var(--color-wrong)' : 'var(--text-muted)' }}>
                        {r.errors}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <RankBadge wpm={r.wpm} size="sm" />
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        {new Date(r.created_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No tests recorded yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function LockIcon({ color }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
