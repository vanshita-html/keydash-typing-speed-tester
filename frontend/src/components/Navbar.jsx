import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Keyboard,
  BarChart3,
  Trophy,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/sound';

export function Navbar() {
  const { user, isAuthenticated, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const toggleSound = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) sound.playKeyClick();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        padding: '16px 24px',
        borderBottom: '2px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface-glass)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--accent-coral)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-coral-keycap)',
              border: '2px solid #1F1B2E',
            }}
          >
            <Keyboard size={24} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              Key<span style={{ color: 'var(--accent-coral)' }}>Dash</span>
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              TYPING SPEED TEST
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            to="/"
            className={`keycap-btn keycap-btn-sm ${isActive('/') ? 'is-active' : ''}`}
            style={{
              backgroundColor: isActive('/') ? 'var(--accent-coral-subtle)' : 'var(--bg-surface)',
              borderColor: isActive('/') ? 'var(--accent-coral)' : 'var(--border-color)',
              color: isActive('/') ? 'var(--accent-coral)' : 'var(--text-primary)',
            }}
          >
            <Keyboard size={16} /> Test
          </Link>

          <Link
            to="/dashboard"
            className={`keycap-btn keycap-btn-sm ${isActive('/dashboard') ? 'is-active' : ''}`}
            style={{
              backgroundColor: isActive('/dashboard') ? 'var(--accent-lavender-subtle)' : 'var(--bg-surface)',
              borderColor: isActive('/dashboard') ? 'var(--accent-lavender)' : 'var(--border-color)',
              color: isActive('/dashboard') ? 'var(--accent-lavender-hover)' : 'var(--text-primary)',
            }}
          >
            <BarChart3 size={16} /> Dashboard
          </Link>

          <Link
            to="/leaderboard"
            className={`keycap-btn keycap-btn-sm ${isActive('/leaderboard') ? 'is-active' : ''}`}
            style={{
              backgroundColor: isActive('/leaderboard') ? 'var(--accent-yellow-subtle)' : 'var(--bg-surface)',
              borderColor: isActive('/leaderboard') ? 'var(--accent-yellow-dark)' : 'var(--border-color)',
              color: isActive('/leaderboard') ? 'var(--accent-yellow-dark)' : 'var(--text-primary)',
            }}
          >
            <Trophy size={16} /> Leaderboard
          </Link>
        </nav>

        {/* Action Controls & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="keycap-btn keycap-btn-sm"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX size={16} color="var(--text-muted)" /> : <Volume2 size={16} color="var(--accent-coral)" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="keycap-btn keycap-btn-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} color="var(--accent-lavender-hover)" /> : <Sun size={16} color="var(--accent-yellow)" />}
          </button>

          {/* Auth State */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                <UserIcon size={14} color="var(--accent-coral)" />
                <span>{user.username}</span>
              </div>
              <button
                onClick={logout}
                className="keycap-btn keycap-btn-sm"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="keycap-btn keycap-btn-primary keycap-btn-sm"
              style={{ marginLeft: '6px' }}
            >
              <LogIn size={15} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
