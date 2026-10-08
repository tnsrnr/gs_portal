'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  stealth: boolean;
  toggleStealth: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [stealth, setStealth] = useState<boolean>(false);

  // 로컬 스토리지에서 테마 설정 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('htns-theme') as Theme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setThemeState(savedTheme);
    }
    setStealth(localStorage.getItem('htns-stealth') === 'true');
  }, []);

  // 시크릿 모드: html에 data-stealth 속성 설정
  useEffect(() => {
    document.documentElement.setAttribute('data-stealth', String(stealth));
  }, [stealth]);

  // 시크릿 모드: 브라우저 탭 제목 숨김 (빈 문자열이면 크롬이 URL을 표시하므로 zero-width space 사용)
  useEffect(() => {
    if (!stealth) return;
    const BLANK = '\u200B';
    const originalTitle = document.title;
    document.title = BLANK;
    const observer = new MutationObserver(() => {
      if (document.title !== BLANK) document.title = BLANK;
    });
    observer.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => {
      observer.disconnect();
      document.title = originalTitle;
    };
  }, [stealth]);

  // 테마 변경 시 로컬 스토리지에 저장
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('htns-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const toggleStealth = () => {
    setStealth(prev => {
      localStorage.setItem('htns-stealth', String(!prev));
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, stealth, toggleStealth }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
