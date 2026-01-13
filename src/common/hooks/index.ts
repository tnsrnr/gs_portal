import { useState, useEffect } from 'react';

// 재사용 가능한 커스텀 훅들
export const useApi = () => {
  // API 호출 관련 훅
  return {
    get: async (url: string) => {
      // GET 요청 로직
    },
    post: async (url: string, data: any) => {
      // POST 요청 로직
    }
  };
};

export const useLocalStorage = (key: string, initialValue: any) => {
  // 로컬 스토리지 훅
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('로컬 스토리지 저장 실패:', error);
    }
  };

  return [storedValue, setValue];
};

export const useDebounce = (value: any, delay: number) => {
  // 디바운스 훅
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
