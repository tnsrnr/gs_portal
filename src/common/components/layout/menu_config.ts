import { 
  Edit3,
  Eye
} from "lucide-react";
import type { LucideIcon } from 'lucide-react';

export interface SubMenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
}

export interface MenuItem {
  name: string;
  path: string;
  icon?: LucideIcon;
  description?: string;
  submenu?: SubMenuItem[];
}

// 학습 자료 관리 메뉴 구조
export const menuItems: MenuItem[] = [
  { 
    name: '입력', 
    path: '/input', 
    icon: Edit3,
    description: '학습 자료 입력'
  },
  { 
    name: '조회', 
    path: '/view', 
    icon: Eye,
    description: '학습 자료 조회'
  }
];

// 유틸리티 함수들
export const getMenuByPath = (path: string): MenuItem | undefined => {
  return menuItems.find(item => item.path === path);
};

export const getAllMenuPaths = (): string[] => {
  return menuItems.map(item => item.path);
};
