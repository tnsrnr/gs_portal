import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { menuItems, MenuItem } from '@/common/components/layout/menu_config';

interface GlobalStore {
  // 전역 조회 상태
  isRefreshing: boolean;
  currentPage: 'page1' | 'page2' | 'page3';
  
  // 년/월 정보
  selectedYear: number;
  selectedMonth: number;
  
  // 메뉴 순서 관리
  menuOrder: string[]; // 메뉴 path들의 순서
  isMenuEditMode: boolean; // 메뉴 편집 모드
  
  // 액션
  setRefreshing: (refreshing: boolean) => void;
  setCurrentPage: (page: 'page1' | 'page2' | 'page3') => void;
  setSelectedYear: (year: number) => void;
  setSelectedMonth: (month: number) => void;
  triggerGlobalRefresh: () => void;
  
  // 메뉴 순서 관리 액션
  setMenuOrder: (order: string[]) => void;
  toggleMenuEditMode: () => void;
  resetMenuOrder: () => void;
  getOrderedMenus: () => MenuItem[];
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isRefreshing: false,
      currentPage: 'page1',
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth() + 1,
      menuOrder: menuItems.slice(1).map(item => item.path), // HTNS 로고 제외한 메뉴들의 기본 순서
      isMenuEditMode: false,
      
      // 상태 설정
      setRefreshing: (refreshing) => set({ isRefreshing: refreshing }),
      setCurrentPage: (page) => {
        console.log('📄 currentPage 변경:', page);
        set({ currentPage: page });
      },
      setSelectedYear: (year) => {
        console.log('📅 selectedYear 변경:', year);
        set({ selectedYear: year });
      },
      setSelectedMonth: (month) => {
        console.log('📅 selectedMonth 변경:', month);
        set({ selectedMonth: month });
      },
      
      // 전역 조회 트리거
      triggerGlobalRefresh: () => {
        set({ isRefreshing: true });
        
        // 현재 페이지에 따라 다른 조회 로직 실행
        const currentPage = get().currentPage;
        console.log('🔍 전역 조회 트리거:', currentPage);
        
        // 1초 후 상태 초기화
        setTimeout(() => {
          set({ isRefreshing: false });
        }, 1000);
      },
      
      // 메뉴 순서 관리 액션
      setMenuOrder: (order) => set({ menuOrder: order }),
      toggleMenuEditMode: () => set((state) => ({ isMenuEditMode: !state.isMenuEditMode })),
      resetMenuOrder: () => set({ menuOrder: menuItems.slice(1).map(item => item.path) }),
      getOrderedMenus: () => {
        const { menuOrder } = get();
        const orderedMenus: MenuItem[] = [];
        
        // HTNS 로고는 항상 첫 번째
        orderedMenus.push(menuItems[0]);
        
        // menuOrder에 따라 메뉴들을 정렬
        menuOrder.forEach(path => {
          const menu = menuItems.find(item => item.path === path);
          if (menu) {
            orderedMenus.push(menu);
          }
        });
        
        // menuOrder에 없는 메뉴들도 추가
        menuItems.slice(1).forEach(menu => {
          if (!menuOrder.includes(menu.path)) {
            orderedMenus.push(menu);
          }
        });
        
        return orderedMenus;
      }
    }),
    {
      name: 'htns-global-store',
      partialize: (state) => ({
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        menuOrder: state.menuOrder,
        currentPage: state.currentPage,
      }),
    }
  )
); 