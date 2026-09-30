import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '48px 32px' }}>
        <div
          style={{
            fontSize: '5rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--accent-coral)',
            lineHeight: 1,
            marginBottom: '12px',
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
          Looks like this key combination doesn't exist! Let's get you back onto the home typing track.
        </p>
        <Link to="/" className="keycap-btn keycap-btn-primary keycap-btn-lg">
          <ArrowLeft size={18} /> Back to Typing Test
        </Link>
      </div>
    </div>
  );
}
