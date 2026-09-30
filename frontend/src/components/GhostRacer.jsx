import React from 'react';
import { Ghost, User, Zap } from 'lucide-react';

export function GhostRacer({
  userProgress = 0, // 0 - 100 percentage
  ghostProgress = 0, // 0 - 100 percentage
  ghostWpm = 0,
  userWpm = 0,
  enabled = true,
  onToggle = () => {},
}) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '2px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
          <Zap size={16} color="var(--accent-coral)" />
          <span>Ghost Pace Racer</span>
          {ghostWpm > 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              (Target: {ghostWpm} WPM)
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="keycap-btn keycap-btn-sm"
          style={{ fontSize: '0.78rem', padding: '3px 10px' }}
        >
          {enabled ? '👻 Ghost On' : 'Ghost Off'}
        </button>
      </div>

      {enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* User Track */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, minWidth: '45px' }}>You</span>
            <div
              style={{
                flex: 1,
                height: '10px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, userProgress))}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-coral)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', minWidth: '55px', textAlign: 'right' }}>
              {userWpm} WPM
            </span>
          </div>

          {/* Ghost Track */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.85 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, minWidth: '45px', color: 'var(--accent-lavender-hover)' }}>
              Ghost
            </span>
            <div
              style={{
                flex: 1,
                height: '10px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, ghostProgress))}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-lavender)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', minWidth: '55px', textAlign: 'right', color: 'var(--text-secondary)' }}>
              {ghostWpm || 60} WPM
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
