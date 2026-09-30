import React from 'react';

export const getRankDetails = (wpm) => {
  if (wpm >= 110) {
    return {
      title: 'Rocket',
      emoji: '🚀',
      color: '#FF4D4D',
      bg: 'rgba(255, 77, 77, 0.15)',
      description: 'Superhuman speed! You are flying across the keys.',
    };
  } else if (wpm >= 90) {
    return {
      title: 'Cheetah',
      emoji: '🐆',
      color: '#FF9F1C',
      bg: 'rgba(255, 159, 28, 0.15)',
      description: 'Lightning fast! Exceptional reflexes and precision.',
    };
  } else if (wpm >= 70) {
    return {
      title: 'Sprinter',
      emoji: '🏃💨',
      color: '#2EC4B6',
      bg: 'rgba(46, 196, 182, 0.15)',
      description: 'Swift and steady! Higher than average typing speed.',
    };
  } else if (wpm >= 50) {
    return {
      title: 'Cyclist',
      emoji: '🚴',
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      description: 'Cruising smoothly with strong rhythm and flow.',
    };
  } else if (wpm >= 30) {
    return {
      title: 'Walker',
      emoji: '🚶',
      color: '#C9A7F5',
      bg: 'rgba(201, 167, 245, 0.2)',
      description: 'Building fundamentals! Keep practicing daily.',
    };
  } else {
    return {
      title: 'Snail',
      emoji: '🐌',
      color: '#A0AEC0',
      bg: 'rgba(160, 174, 192, 0.2)',
      description: 'Starting out! Relax your hands and focus on accuracy.',
    };
  }
};

export function RankBadge({ wpm, size = 'md', showDescription = false }) {
  const rank = getRankDetails(wpm);

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: showDescription ? 'column' : 'row',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'lg' ? '8px 18px' : '4px 12px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: rank.bg,
        border: `2px solid ${rank.color}`,
        color: 'var(--text-primary)',
        fontWeight: 700,
        fontFamily: 'var(--font-display)',
        fontSize: size === 'lg' ? '1.15rem' : '0.9rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: size === 'lg' ? '1.5rem' : '1.1rem' }}>{rank.emoji}</span>
        <span style={{ color: rank.color }}>{rank.title}</span>
      </div>
      {showDescription && (
        <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-secondary)' }}>
          {rank.description}
        </span>
      )}
    </div>
  );
}
