import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  RotateCcw,
  FilePlus,
  Trophy,
  Target,
  Zap,
  AlertCircle,
  Activity,
  LogIn,
  CheckCircle,
} from 'lucide-react';
import { RankBadge } from './RankBadge';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export function ResultsModal({
  stats,
  mode,
  textId,
  onRetry,
  onNewText,
}) {
  const { user, isAuthenticated, getBestForMode, updatePersonalBest } = useAuth();
  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [animatedWpm, setAnimatedWpm] = useState(0);

  const prevBestWpm = getBestForMode(mode);

  // Check PB and Trigger Confetti
  useEffect(() => {
    if (stats.wpm > prevBestWpm && stats.wpm > 0) {
      setIsNewPersonalBest(true);
      updatePersonalBest(mode, stats.wpm);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B5E', '#C9A7F5', '#FFE27A', '#2EC4B6'],
        });
      } catch (e) {}
    }
  }, [stats.wpm, prevBestWpm, mode, updatePersonalBest]);

  // Animate WPM number counting up
  useEffect(() => {
    let start = 0;
    const end = stats.wpm;
    if (end === 0) return;
    const stepTime = Math.max(10, Math.floor(1000 / end));
    const timer = setInterval(() => {
      start += 1;
      setAnimatedWpm(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [stats.wpm]);

  // Automatically save score if user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isSaved && stats.wpm > 0) {
      const payload = {
        text_id: textId,
        mode: mode,
        duration: stats.duration,
        wpm: stats.wpm,
        raw_wpm: stats.rawWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        consistency: stats.consistency,
      };

      api
        .saveResult(payload)
        .then(() => setIsSaved(true))
        .catch((err) => {
          console.error('Error saving test result:', err);
          setSaveError(err.message);
        });
    }
  }, [isAuthenticated, isSaved, stats, textId, mode]);

  // Keyboard shortcut listener for Tab + Enter or Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onRetry();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRetry]);

  // Accuracy Ring Calculation (circumference = 2 * PI * r)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.accuracy / 100) * circumference;

  // Chart data format
  const chartData =
    stats.wpmHistory && stats.wpmHistory.length > 0
      ? stats.wpmHistory.map((item) => ({
          time: `${item.second}s`,
          wpm: item.wpm,
          rawWpm: item.rawWpm,
        }))
      : [
          { time: '0s', wpm: 0, rawWpm: 0 },
          { time: `${Math.round(stats.duration)}s`, wpm: stats.wpm, rawWpm: stats.rawWpm },
        ];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <RankBadge wpm={stats.wpm} size="lg" />
            {isNewPersonalBest && (
              <span className="sticker-badge sticker-badge-coral" style={{ animation: 'sparkle-pulse 1s infinite alternate' }}>
                <Trophy size={14} /> New Personal Best!
              </span>
            )}
          </div>
          <span className="sticker-badge sticker-badge-lavender">
            Mode: {mode.replace('_', ' ')}
          </span>
        </div>

        {/* Main Big Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
            textAlign: 'center',
          }}
        >
          {/* Big WPM Hero */}
          <div
            style={{
              padding: '20px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
              WPM
            </div>
            <div
              style={{
                fontSize: '3.4rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-coral)',
                lineHeight: 1,
              }}
            >
              {animatedWpm}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Net Words / Min
            </div>
          </div>

          {/* Accuracy Circular Gauge */}
          <div
            style={{
              padding: '16px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>
              ACCURACY
            </div>
            <div style={{ position: 'relative', width: '84px', height: '84px' }}>
              <svg width="84" height="84" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="var(--border-subtle)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="var(--accent-mint)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 45 45)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                {stats.accuracy}%
              </div>
            </div>
          </div>

          {/* Raw WPM */}
          <div
            style={{
              padding: '20px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>
              RAW WPM
            </div>
            <div
              style={{
                fontSize: '2.2rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-lavender)',
              }}
            >
              {stats.rawWpm}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>gross speed</div>
          </div>

          {/* Consistency & Errors */}
          <div
            style={{
              padding: '16px 14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                CONSISTENCY
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {stats.consistency}%
              </div>
            </div>
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                ERRORS
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-wrong)' }}>
                {stats.errors}
              </div>
            </div>
          </div>
        </div>

        {/* WPM-over-time Line Graph */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-color)',
            padding: '16px 16px 8px 8px',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', paddingLeft: '12px' }}>
            📈 Speed Progression (WPM / Time)
          </div>
          <div style={{ width: '100%', height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} />
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
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="rawWpm"
                  name="Raw WPM"
                  stroke="var(--accent-lavender)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Guest Banner or Saved Status */}
        {!isAuthenticated ? (
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'var(--accent-lavender-subtle)',
              border: '2px dashed var(--accent-lavender)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              👋 <strong>Playing as Guest:</strong> Sign in to save this score, track your growth, and rank on the leaderboard!
            </div>
            <button
              onClick={() => navigate('/login')}
              className="keycap-btn keycap-btn-secondary keycap-btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              <LogIn size={14} /> Sign In
            </button>
          </div>
        ) : isSaved ? (
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--color-correct-bg)',
              color: 'var(--color-correct)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            <CheckCircle size={16} /> Score saved to your profile and leaderboard!
          </div>
        ) : saveError ? (
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--color-wrong-bg)',
              color: 'var(--color-wrong)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} /> {saveError}
          </div>
        ) : null}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onRetry}
            className="keycap-btn keycap-btn-primary keycap-btn-lg"
            title="Shortcut: Enter or Tab+Enter"
            autoFocus
          >
            <RotateCcw size={18} /> Try Again <span style={{ opacity: 0.7, fontSize: '0.8rem', marginLeft: '4px' }}>↵</span>
          </button>
          <button onClick={onNewText} className="keycap-btn keycap-btn-lg">
            <FilePlus size={18} /> Next Text
          </button>
        </div>
      </div>
    </div>
  );
}
