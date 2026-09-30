import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { sound } from '../utils/sound';

export function useTypingTest({
  mode = 'time_30',
  category = 'medium',
  ghostWpm = 0,
  onComplete = () => {},
}) {
  const [targetText, setTargetText] = useState('');
  const [textId, setTextId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Status: 'idle' | 'running' | 'paused' | 'completed'
  const [status, setStatus] = useState('idle');
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(true);

  // Time & Progress State
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [wordCountTarget, setWordCountTarget] = useState(25);

  // Error Tracking
  const [totalErrors, setTotalErrors] = useState(0); // Cumulative errors (including backspaced ones)
  const [charErrorsMap, setCharErrorsMap] = useState({}); // index -> boolean

  // Timeline & Stats History
  const [wpmHistory, setWpmHistory] = useState([]); // [{ second, wpm, rawWpm, errors }]
  const [lastKeyPressed, setLastKeyPressed] = useState(null);
  const [wrongKeyFlashed, setWrongKeyFlashed] = useState(null);

  // Ghost racer caret index
  const [ghostIndex, setGhostIndex] = useState(0);

  // Refs for accurate timing without closure staleness
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeAccumRef = useRef(0);
  const pauseStartRef = useRef(null);
  const historyRef = useRef([]);
  const inputRef = useRef('');
  const totalErrorsRef = useRef(0);

  // Parse mode configuration
  const isTimeMode = mode.startsWith('time_');
  const initialTimeLimit = isTimeMode ? parseInt(mode.split('_')[1], 10) || 30 : 60;
  const initialWordLimit = !isTimeMode ? parseInt(mode.split('_')[1], 10) || 25 : 0;

  // Load new random practice text
  const fetchText = useCallback(async () => {
    setIsLoadingText(true);
    try {
      const data = await api.getText(category, 'medium', mode);
      let content = data.content.trim();

      // If word mode, adjust or replicate text length if needed to satisfy word target
      if (!isTimeMode) {
        const words = content.split(/\s+/);
        if (words.length < initialWordLimit) {
          // repeat words to match word target
          const repeated = [];
          while (repeated.length < initialWordLimit) {
            repeated.push(...words);
          }
          content = repeated.slice(0, initialWordLimit).join(' ');
        } else {
          content = words.slice(0, initialWordLimit).join(' ');
        }
      }

      setTargetText(content);
      setTextId(data.id || null);
    } catch (err) {
      // Fallback text if backend is offline
      const fallback = "The quick brown fox jumps over the lazy dog. Practice typing every single day to boost your words per minute and overall accuracy.";
      setTargetText(fallback);
    } finally {
      setIsLoadingText(false);
    }
  }, [category, mode, isTimeMode, initialWordLimit]);

  // Reset entire typing session
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('idle');
    setIsPaused(false);
    setUserInput('');
    setCurrentIndex(0);
    setElapsedTime(0);
    setTimeLeft(initialTimeLimit);
    setWordCountTarget(initialWordLimit);
    setTotalErrors(0);
    setCharErrorsMap({});
    setWpmHistory([]);
    setGhostIndex(0);
    setLastKeyPressed(null);
    setWrongKeyFlashed(null);

    inputRef.current = '';
    totalErrorsRef.current = 0;
    historyRef.current = [];
    startTimeRef.current = null;
    pausedTimeAccumRef.current = 0;
    pauseStartRef.current = null;
  }, [initialTimeLimit, initialWordLimit]);

  // Initial load & mode change reset
  useEffect(() => {
    resetTest();
    fetchText();
  }, [fetchText, resetTest]);

  // Compute live WPM and Accuracy
  const calculateStats = useCallback(() => {
    const rawElapsed = elapsedTime > 0 ? elapsedTime : 0.1;
    const minutes = rawElapsed / 60;
    const typed = inputRef.current;
    let correctChars = 0;

    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetText[i]) {
        correctChars++;
      }
    }

    // Standard WPM formula: (correct characters / 5) / minutes
    const wpm = minutes > 0 ? Math.max(0, Math.round((correctChars / 5) / minutes)) : 0;
    
    // Raw WPM: (all typed characters / 5) / minutes
    const rawWpm = minutes > 0 ? Math.max(0, Math.round((typed.length / 5) / minutes)) : 0;

    // Accuracy: (correct characters / total typed characters) * 100
    const accuracy = typed.length > 0 
      ? Math.max(0, Math.min(100, Math.round((correctChars / typed.length) * 100 * 10) / 10)) 
      : 100;

    // Consistency: variance of snapshot WPMs
    let consistency = 100;
    if (historyRef.current.length >= 3) {
      const wpms = historyRef.current.map((h) => h.wpm);
      const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
      if (mean > 5) {
        const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        const coeffVariation = (stdDev / mean) * 100;
        consistency = Math.max(10, Math.min(100, Math.round(100 - coeffVariation)));
      }
    }

    return {
      wpm,
      rawWpm,
      accuracy,
      errors: totalErrorsRef.current,
      consistency,
      duration: Number(rawElapsed.toFixed(1)),
      wpmHistory: historyRef.current,
    };
  }, [elapsedTime, targetText]);

  // Finish test callback
  const finishTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('completed');
    const finalStats = calculateStats();
    sound.playSuccessChime();
    onComplete(finalStats);
  }, [calculateStats, onComplete]);

  // Main Timer Tick (runs every 100ms for smooth live updates and second snapshots)
  useEffect(() => {
    if (status === 'running' && !isPaused) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const totalElapsedMs = now - startTimeRef.current - pausedTimeAccumRef.current;
        const elapsedSec = totalElapsedMs / 1000;
        setElapsedTime(elapsedSec);

        // Update Ghost Racer caret position based on PB WPM
        // ghostWpm in chars/sec = (ghostWpm * 5) / 60
        if (ghostWpm > 0) {
          const ghostChars = Math.floor(((ghostWpm * 5) / 60) * elapsedSec);
          setGhostIndex(Math.min(targetText.length, ghostChars));
        }

        // Record history snapshot every whole second
        const currentSec = Math.floor(elapsedSec);
        if (currentSec > 0 && !historyRef.current.some((h) => h.second === currentSec)) {
          const minutes = elapsedSec / 60;
          let correct = 0;
          for (let i = 0; i < inputRef.current.length; i++) {
            if (inputRef.current[i] === targetText[i]) correct++;
          }
          const snapshotWpm = Math.round((correct / 5) / minutes);
          const snapshotRaw = Math.round((inputRef.current.length / 5) / minutes);
          const snap = {
            second: currentSec,
            wpm: Math.max(0, snapshotWpm),
            rawWpm: Math.max(0, snapshotRaw),
            errors: totalErrorsRef.current,
          };
          historyRef.current.push(snap);
          setWpmHistory([...historyRef.current]);
        }

        // Check if Time mode has ended
        if (isTimeMode) {
          const remaining = Math.max(0, Math.ceil(initialTimeLimit - elapsedSec));
          setTimeLeft(remaining);
          if (remaining <= 0) {
            finishTest();
          }
        }
      }, 100);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, isPaused, isTimeMode, initialTimeLimit, ghostWpm, targetText.length, finishTest]);

  // Auto-pause when tab loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && status === 'running') {
        setIsPaused(true);
        pauseStartRef.current = Date.now();
      }
    };

    const handleBlur = () => {
      if (status === 'running') {
        setIsPaused(true);
        pauseStartRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [status]);

  // Resume paused test
  const resumeTest = useCallback(() => {
    if (isPaused && pauseStartRef.current) {
      pausedTimeAccumRef.current += Date.now() - pauseStartRef.current;
      pauseStartRef.current = null;
      setIsPaused(false);
    }
  }, [isPaused]);

  // Handle Keystroke Input
  const handleKeyDown = useCallback(
    (e) => {
      // Allow shortcuts: Tab + Enter or Escape to restart
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
        fetchText();
        return;
      }

      if (status === 'completed') return;

      // Handle Backspace
      if (e.key === 'Backspace') {
        if (userInput.length > 0) {
          const nextInput = userInput.slice(0, -1);
          setUserInput(nextInput);
          inputRef.current = nextInput;
          setCurrentIndex(nextInput.length);
          sound.playKeyClick();
          setLastKeyPressed('Backspace');
        }
        return;
      }

      // Ignore modifiers / function keys
      if (
        e.key.length !== 1 ||
        e.ctrlKey ||
        e.altKey ||
        e.metaKey
      ) {
        return;
      }

      e.preventDefault();
      const pressedChar = e.key;

      // Start timer on very first keystroke
      if (status === 'idle') {
        setStatus('running');
        startTimeRef.current = Date.now();
        pausedTimeAccumRef.current = 0;
      }

      // If paused, auto-resume
      if (isPaused) {
        resumeTest();
      }

      const nextIndex = userInput.length;
      const expectedChar = targetText[nextIndex];
      const isCorrect = pressedChar === expectedChar;

      // Virtual keyboard feedback
      setLastKeyPressed(pressedChar === ' ' ? 'Space' : pressedChar.toUpperCase());

      if (isCorrect) {
        sound.playKeyClick(pressedChar === ' ');
      } else {
        sound.playErrorSound();
        setWrongKeyFlashed(pressedChar === ' ' ? 'Space' : pressedChar.toUpperCase());
        setTimeout(() => setWrongKeyFlashed(null), 300);

        // Record total error count
        totalErrorsRef.current += 1;
        setTotalErrors(totalErrorsRef.current);
        setCharErrorsMap((prev) => ({ ...prev, [nextIndex]: true }));
      }

      const nextInput = userInput + pressedChar;
      setUserInput(nextInput);
      inputRef.current = nextInput;
      setCurrentIndex(nextInput.length);

      // Check if text is completed (for Words mode or if entire text finished in Time mode)
      if (nextInput.length >= targetText.length) {
        finishTest();
      }
    },
    [userInput, status, isPaused, targetText, resetTest, fetchText, resumeTest, finishTest]
  );

  return {
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
    wpmHistory,
    ghostIndex,
    lastKeyPressed,
    wrongKeyFlashed,
    stats: calculateStats(),
    resetTest,
    fetchNewText: () => {
      resetTest();
      fetchText();
    },
    resumeTest,
    handleKeyDown,
  };
}
