// 글로벌 상태 관리
export * from './store/slices/global';

// 글로벌 라이브러리
export * from './lib/chart';
export * from './lib/ui';

// 글로벌 스타일 (CSS는 별도 import 필요)
export const GLOBAL_STYLES_PATH = './styles/globals.css';

// 글로벌 설정 상수
export const GLOBAL_CONFIG = {
  APP_NAME: 'HTNS',
  VERSION: '1.0.0',
  SESSION_KEY: 'htns-session',
  API_BASE_URL: process.env.SPRING_SERVER_URL || 'https://qa-lv1.htns.com',
} as const;

// 글로벌 타입 정의
export interface GlobalConfig {
  readonly APP_NAME: string;
  readonly VERSION: string;
  readonly SESSION_KEY: string;
  readonly API_BASE_URL: string;
}
