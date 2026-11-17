'use client';

import { useEffect, useState } from 'react';

export const STUDY_FONT_BASE = 15;
export const STUDY_FONT_MIN = 11;
export const STUDY_FONT_MAX = 28;
const STORAGE_KEY = 'study2-font-size';

function clampSize(value: number) {
  return Math.min(STUDY_FONT_MAX, Math.max(STUDY_FONT_MIN, value));
}

export function useStudyFont() {
  const [size, setSizeState] = useState(STUDY_FONT_BASE);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return;
    const saved = Number(raw);
    if (Number.isInteger(saved)) setSizeState(clampSize(saved));
  }, []);

  const setSize = (next: number) => {
    const value = clampSize(next);
    setSizeState(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  };

  return { size, setSize };
}

export function studyFontZoom(size: number) {
  return size / STUDY_FONT_BASE;
}

export function FontStepControl({
  size,
  onChange,
}: {
  size: number;
  onChange: (size: number) => void;
}) {
  const buttonStyle = {
    color: 'var(--text-secondary)',
    background: 'transparent',
  };

  return (
    <div
      className="flex items-center rounded-full border p-1"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-tertiary)' }}
    >
      <button
        type="button"
        aria-label="글자 1 줄이기"
        disabled={size <= STUDY_FONT_MIN}
        onClick={() => onChange(size - 1)}
        className="rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-40"
        style={buttonStyle}
      >
        −1
      </button>
      <span
        className="min-w-[2.25rem] text-center text-sm font-semibold tabular-nums"
        style={{ color: 'var(--text-primary)' }}
        aria-live="polite"
      >
        {size}
      </span>
      <button
        type="button"
        aria-label="글자 1 키우기"
        disabled={size >= STUDY_FONT_MAX}
        onClick={() => onChange(size + 1)}
        className="rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-40"
        style={buttonStyle}
      >
        +1
      </button>
    </div>
  );
}
