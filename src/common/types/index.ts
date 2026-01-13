// 공통 타입 정의들

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 사용자 기본 타입
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// 메뉴 아이템 타입
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  permission?: string;
}

// 테이블 컬럼 타입
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
}

// 차트 데이터 타입
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}

// 필터 타입
export interface FilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// 상태 타입
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// 정렬 타입
export type SortOrder = 'asc' | 'desc';

// 크기 타입
export type Size = 'small' | 'medium' | 'large';

// 색상 타입
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
