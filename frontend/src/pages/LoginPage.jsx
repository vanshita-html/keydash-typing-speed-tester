import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import illustrationUrl from '../assets/login-illustration.svg';

export function LoginPage() {
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('typing123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username.trim(), password.trim());
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 450);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (platform) => {
    setError(`Social sign-in with ${platform} is decorative in demo mode. Please use demo credentials.`);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 450);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 20px',
        background: 'radial-gradient(circle at top left, var(--accent-lavender-subtle) 0%, var(--bg-primary) 60%)',
      }}
    >
      {/* Large Centered 2-Column Split Card */}
      <div
        className={`card ${isShaking ? 'shake-animation' : ''}`}
        style={{
          maxWidth: '920px',
          width: '100%',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '2px solid var(--border-color)',
        }}
      >
        {/* LEFT HALF: Rounded Panel with Vector Illustration */}
        <div
          style={{
            backgroundColor: 'var(--accent-lavender-subtle)',
            borderRight: '2px solid var(--border-color)',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={illustrationUrl}
              alt="Person typing happily on mechanical keyboard with floating keycaps"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Master your rhythm & speed. 🚀
          </div>
        </div>

        {/* RIGHT HALF: Login Form */}
        <div
          style={{
            padding: '44px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Top Right "Register now" */}
          <div
            style={{
              textAlign: 'right',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              marginBottom: '24px',
            }}
          >
            Not a member?{' '}
            <button
              type="button"
              onClick={() => setError("Demo app is invite-only! Sign in with 'demo' / 'typing123' to test.")}
              style={{ color: 'var(--accent-coral)', fontWeight: 600, cursor: 'pointer' }}
            >
              Register now
            </button>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '2.1rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              marginBottom: '6px',
            }}
          >
            Hello Again!
          </h2>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-secondary)',
              marginBottom: '28px',
            }}
          >
            Welcome back to KeyDash, you've been missed!
          </p>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: 'var(--color-wrong-bg)',
                color: 'var(--color-wrong)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '18px',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <User size={18} color="var(--text-muted)" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            {/* Password */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--bg-secondary)',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Lock size={18} color="var(--text-muted)" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Recovery Password Link */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setError("Hint: Demo password is 'typing123'")}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Recovery Password
              </button>
            </div>

            {/* Full-width Coral Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="keycap-btn keycap-btn-primary keycap-btn-lg"
              style={{ width: '100%', marginTop: '4px' }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Hint */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '12px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--accent-yellow-subtle)',
              border: '1px dashed var(--accent-yellow-dark)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            💡 <strong>Demo login:</strong> username: <code>demo</code> / password: <code>typing123</code>
          </div>

          {/* "or continue with" Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '22px 0 16px',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          </div>

          {/* Three Round Social Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '18px' }}>
            {/* Google */}
            <button
              onClick={() => handleSocialClick('Google')}
              className="keycap-btn"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                padding: 0,
                fontSize: '1rem',
                fontWeight: 700,
              }}
              title="Google"
            >
              G
            </button>
            {/* Apple */}
            <button
              onClick={() => handleSocialClick('Apple')}
              className="keycap-btn"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                padding: 0,
                fontSize: '1.1rem',
              }}
              title="Apple"
            >
              
            </button>
            {/* Facebook */}
            <button
              onClick={() => handleSocialClick('Facebook')}
              className="keycap-btn"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                padding: 0,
                fontSize: '1rem',
                fontWeight: 700,
                color: '#1877F2',
              }}
              title="Facebook"
            >
              f
            </button>
          </div>

          {/* Clear "Continue as Guest" Link */}
          <div style={{ textAlign: 'center' }}>
            <Link
              to="/"
              style={{
                fontSize: '0.9rem',
                color: 'var(--accent-coral)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Continue as Guest <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
