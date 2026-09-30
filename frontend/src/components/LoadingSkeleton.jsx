import React from 'react';

export function LoadingSkeleton({ height = '40px', width = '100%', borderRadius = 'var(--radius-md)', style = {} }) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--bg-secondary)',
        backgroundImage: 'linear-gradient(90deg, var(--bg-secondary) 0px, var(--bg-subtle) 40px, var(--bg-secondary) 80px)',
        backgroundSize: '300% 100%',
        animation: 'skeleton-shimmer 1.5s infinite',
        ...style,
      }}
    />
  );
}

// Keyframe is injected or styled in CSS
