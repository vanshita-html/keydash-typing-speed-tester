import React, { useState, useRef, useEffect } from 'react';
import {
  Timer,
  FileText,
  RotateCcw,
  Play,
  Pause,
  Zap,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { useTypingTest } from '../hooks/useTypingTest';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { ResultsModal } from '../components/ResultsModal';
import { GhostRacer } from '../components/GhostRacer';
import { useAuth } from '../context/AuthContext';

const MODES = [
  { id: 'time_15', label: '15s', type: 'time', val: 15 },
  { id: 'time_30', label: '30s', type: 'time', val: 30 },
  { id: 'time_60', label: '60s', type: 'time', val: 60 },
  { id: 'time_120', label: '120s', type: 'time', val: 120 },
  { id: 'words_10', label: '10 words', type: 'words', val: 10 },
  { id: 'words_25', label: '25 words', type: 'words', val: 25 },
  { id: 'words_50', label: '50 words', type: 'words', val: 50 },
];

const CATEGORIES = [
  { id: 'easy', label: '🌱 Easy Words' },
  { id: 'medium', label: '✨ Medium Sentences' },
  { id: 'hard', label: '⚡ Hard (Punctuation & #' },
  { id: 'quotes', label: '💬 Quotes' },
];

export function TypingPage() {
  const { getBestForMode } = useAuth();
  const [selectedMode, setSelectedMode] = useState('time_30');
  const [selectedCategory, setSelectedCategory] = useState('medium');
  const [showGhost, setShowGhost] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [completedStats, setCompletedStats] = useState(null);

  const containerRef = useRef(null);

  const bestWpmForCurrentMode = getBestForMode(selectedMode);
  // If no PB recorded, use a helpful ghost baseline of 60 WPM
  const ghostTargetWpm = bestWpmForCurrentMode > 0 ? bestWpmForCurrentMode : 60;

  const {
    targetText,
    textId,
    userInput,
    currentIndex,
    status,
    isPaused,
    isLoadingText,
    elapsedTime,
    timeLeft,
    totalErrors,
    charErrorsMap,
    ghostIndex,
    lastKeyPressed,
    wrongKeyFlashed,
    stats,
    resetTest,
    fetchNewText,
    resumeTest,
    handleKeyDown,
  } = useTypingTest({
    mode: selectedMode,
    category: selectedCategory,
    ghostWpm: showGhost ? ghostTargetWpm : 0,
    onComplete: (finalStats) => {
      setCompletedStats(finalStats);
      setShowResults(true);
    },
  });

  // Keep focus on typing area
  useEffect(() => {
    if (containerRef.current && !showResults) {
      containerRef.current.focus();
    }
  }, [showResults, selectedMode, selectedCategory]);

  const handleRetry = () => {
    setShowResults(false);
    resetTest();
    if (containerRef.current) containerRef.current.focus();
  };

  const handleNewText = () => {
    setShowResults(false);
    fetchNewText();
    if (containerRef.current) containerRef.current.focus();
  };

  // Calculate percentage progress for progress bar & ghost racer
  const userProgress = targetText.length > 0 ? (currentIndex / targetText.length) * 100 : 0;
  const ghostProgress = targetText.length > 0 ? (ghostIndex / targetText.length) * 100 : 0;

  return (
    <main
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1,
      }}
    >
      {/* Top Configuration Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Category Selector */}
        <div className="mode-group" role="tablist" aria-label="Text Categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (containerRef.current) containerRef.current.focus();
              }}
              className={`mode-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mode Selector (Time & Words) */}
        <div className="mode-group" role="tablist" aria-label="Test Modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMode(m.id);
                if (containerRef.current) containerRef.current.focus();
              }}
              className={`mode-pill ${selectedMode === m.id ? 'active' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ghost Racer Pace Bar */}
      <GhostRacer
        userProgress={userProgress}
        ghostProgress={ghostProgress}
        ghostWpm={ghostTargetWpm}
        userWpm={stats.wpm}
        enabled={showGhost}
        onToggle={() => setShowGhost(!showGhost)}
      />

      {/* Live Stats Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 8px',
        }}
      >
        <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>WPM</span>
            <div
              style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-coral)',
                lineHeight: 1,
              }}
            >
              {stats.wpm}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACCURACY</span>
            <div
              style={{
                fontSize: '2.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--accent-mint)',
                lineHeight: 1,
              }}
            >
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Timer / Counter Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-secondary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-color)',
          }}
        >
          <Timer size={20} color="var(--accent-coral)" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {selectedMode.startsWith('time_') ? `${timeLeft}s` : `${userInput.trim().split(/\s+/).filter(Boolean).length} / ${selectedMode.split('_')[1]}`}
          </span>
        </div>
      </div>

      {/* Main Interactive Typing Area Box */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="typing-box-wrapper"
        aria-label="Typing test text container. Start typing to begin."
      >
        {/* Loading overlay if fetching */}
        {isLoadingText ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading fresh challenge text...
          </div>
        ) : (
          <div className="typing-text-display">
            {targetText.split('').map((char, index) => {
              let charClass = 'char-untyped';
              if (index < userInput.length) {
                charClass = userInput[index] === char ? 'char-correct' : 'char-wrong';
              }

              const isUserCaret = index === currentIndex;
              const isGhostCaret = showGhost && index === ghostIndex && status === 'running';

              return (
                <span
                  key={index}
                  className={`${charClass} ${char === ' ' ? 'char-space' : ''}`}
                  style={{ position: 'relative' }}
                >
                  {isUserCaret && <span className="caret-cursor" />}
                  {isGhostCaret && <span className="ghost-caret-cursor" />}
                  {char}
                </span>
              );
            })}
            {/* Caret at very end of text */}
            {currentIndex === targetText.length && <span className="caret-cursor" />}
          </div>
        )}

        {/* Tab Lost Focus / Paused Overlay */}
        {isPaused && (
          <div className="pause-banner">
            <Pause size={36} color="var(--accent-coral)" />
            <h3 style={{ color: '#FFFFFF' }}>Test Paused</h3>
            <p style={{ color: '#DDD', fontSize: '0.9rem' }}>The tab lost focus. Click below or press any key to resume.</p>
            <button
              onClick={resumeTest}
              className="keycap-btn keycap-btn-primary"
              style={{ marginTop: '8px' }}
            >
              <Play size={16} /> Resume Test
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons & Shortcut Hints */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleRetry} className="keycap-btn" title="Restart test">
            <RotateCcw size={16} /> Restart
          </button>
          <button onClick={handleNewText} className="keycap-btn" title="Load new text">
            <Sparkles size={16} color="var(--accent-coral)" /> New Text
          </button>
        </div>

        <div
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>
            <kbd style={{ padding: '2px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>Esc</kbd> or <kbd style={{ padding: '2px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>Tab</kbd> + <kbd style={{ padding: '2px 6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>Enter</kbd> to restart
          </span>
        </div>
      </div>

      {/* Interactive Virtual Keyboard */}
      <VirtualKeyboard activeKey={lastKeyPressed} wrongKey={wrongKeyFlashed} />

      {/* Results Modal */}
      {showResults && completedStats && (
        <ResultsModal
          stats={completedStats}
          mode={selectedMode}
          textId={textId}
          onRetry={handleRetry}
          onNewText={handleNewText}
        />
      )}
    </main>
  );
}
