'use client';

import { useTheme as useThemeContext } from '../contexts/ThemeContext';
import { useEffect } from 'react';

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeContext();

  // 테마 변경 시 document에 data-theme 속성 설정
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
