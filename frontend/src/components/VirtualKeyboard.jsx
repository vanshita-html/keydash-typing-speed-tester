import React from 'react';

const KEYBOARD_ROWS = [
  [
    { key: '`', label: '~ `', code: 'Backquote' },
    { key: '1', label: '! 1', code: 'Digit1' },
    { key: '2', label: '@ 2', code: 'Digit2' },
    { key: '3', label: '# 3', code: 'Digit3' },
    { key: '4', label: '$ 4', code: 'Digit4' },
    { key: '5', label: '% 5', code: 'Digit5' },
    { key: '6', label: '^ 6', code: 'Digit6' },
    { key: '7', label: '& 7', code: 'Digit7' },
    { key: '8', label: '* 8', code: 'Digit8' },
    { key: '9', label: '( 9', code: 'Digit9' },
    { key: '0', label: ') 0', code: 'Digit0' },
    { key: '-', label: '_ -', code: 'Minus' },
    { key: '=', label: '+ =', code: 'Equal' },
    { key: 'Backspace', label: '⌫ Back', className: 'vk-key-wider' },
  ],
  [
    { key: 'Tab', label: 'Tab', className: 'vk-key-wide' },
    { key: 'Q', label: 'Q' },
    { key: 'W', label: 'W' },
    { key: 'E', label: 'E' },
    { key: 'R', label: 'R' },
    { key: 'T', label: 'T' },
    { key: 'Y', label: 'Y' },
    { key: 'U', label: 'U' },
    { key: 'I', label: 'I' },
    { key: 'O', label: 'O' },
    { key: 'P', label: 'P' },
    { key: '[', label: '{ [' },
    { key: ']', label: '} ]' },
    { key: '\\', label: '| \\', className: 'vk-key-wide' },
  ],
  [
    { key: 'CapsLock', label: 'Caps', className: 'vk-key-wider' },
    { key: 'A', label: 'A' },
    { key: 'S', label: 'S' },
    { key: 'D', label: 'D' },
    { key: 'F', label: 'F' },
    { key: 'G', label: 'G' },
    { key: 'H', label: 'H' },
    { key: 'J', label: 'J' },
    { key: 'K', label: 'K' },
    { key: 'L', label: 'L' },
    { key: ';', label: ': ;' },
    { key: "'", label: '" \'' },
    { key: 'Enter', label: 'Enter ↵', className: 'vk-key-widest' },
  ],
  [
    { key: 'Shift', label: 'Shift ⇧', className: 'vk-key-widest' },
    { key: 'Z', label: 'Z' },
    { key: 'X', label: 'X' },
    { key: 'C', label: 'C' },
    { key: 'V', label: 'V' },
    { key: 'B', label: 'B' },
    { key: 'N', label: 'N' },
    { key: 'M', label: 'M' },
    { key: ',', label: '< ,' },
    { key: '.', label: '> .' },
    { key: '/', label: '? /' },
    { key: 'Shift', label: 'Shift ⇧', className: 'vk-key-widest' },
  ],
  [
    { key: 'Space', label: 'Space ␣', className: 'vk-key-space' },
  ],
];

export function VirtualKeyboard({ activeKey, wrongKey }) {
  // Normalize comparison
  const isKeyActive = (keyDef) => {
    if (!activeKey) return false;
    const target = activeKey.toUpperCase();
    return (
      keyDef.key.toUpperCase() === target ||
      (target === ' ' && keyDef.key === 'Space') ||
      (keyDef.label && keyDef.label.includes(activeKey))
    );
  };

  const isKeyWrong = (keyDef) => {
    if (!wrongKey) return false;
    const target = wrongKey.toUpperCase();
    return (
      keyDef.key.toUpperCase() === target ||
      (target === ' ' && keyDef.key === 'Space') ||
      (keyDef.label && keyDef.label.includes(wrongKey))
    );
  };

  return (
    <div className="virtual-keyboard" aria-label="On-screen interactive keyboard">
      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="keyboard-row">
          {row.map((k, kIdx) => {
            const active = isKeyActive(k);
            const wrong = isKeyWrong(k);
            return (
              <div
                key={kIdx}
                className={`vk-key ${k.className || ''} ${active ? 'is-active' : ''} ${
                  wrong ? 'is-wrong-flash' : ''
                }`}
              >
                {k.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
