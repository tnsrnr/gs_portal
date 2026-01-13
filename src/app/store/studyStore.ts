import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TabData, StudyItem } from '../types';

interface StudyStore {
  tabs: TabData[];
  activeTabId: string | null;
  addTab: (name: string) => void;
  removeTab: (tabId: string) => void;
  updateTabName: (tabId: string, name: string) => void;
  addItem: (tabId: string, item: Omit<StudyItem, 'id' | 'no'>) => void;
  updateItem: (tabId: string, itemId: string, item: Partial<StudyItem>) => void;
  removeItem: (tabId: string, itemId: string) => void;
  setActiveTab: (tabId: string | null) => void;
}

export const useStudyStore = create<StudyStore>()(
  persist(
    (set) => ({
  tabs: [],
  activeTabId: null,
  
  addTab: (name: string) => {
    const newTab: TabData = {
      id: Date.now().toString(),
      name,
      items: [],
    };
    set((state) => ({
      tabs: [...state.tabs, newTab],
      activeTabId: newTab.id,
    }));
  },
  
  removeTab: (tabId: string) => {
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== tabId);
      const newActiveTabId = 
        state.activeTabId === tabId
          ? newTabs.length > 0
            ? newTabs[0].id
            : null
          : state.activeTabId;
      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    });
  },
  
  updateTabName: (tabId: string, name: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, name } : tab
      ),
    }));
  },
  
  addItem: (tabId: string, item: Omit<StudyItem, 'id' | 'no'>) => {
    set((state) => {
      const tab = state.tabs.find((t) => t.id === tabId);
      if (!tab) return state;
      
      const newItem: StudyItem = {
        ...item,
        id: Date.now().toString(),
        no: tab.items.length + 1,
      };
      
      return {
        tabs: state.tabs.map((t) =>
          t.id === tabId
            ? { ...t, items: [...t.items, newItem] }
            : t
        ),
      };
    });
  },
  
  updateItem: (tabId: string, itemId: string, item: Partial<StudyItem>) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              items: tab.items.map((i) =>
                i.id === itemId ? { ...i, ...item } : i
              ),
            }
          : tab
      ),
    }));
  },
  
  removeItem: (tabId: string, itemId: string) => {
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              items: tab.items
                .filter((i) => i.id !== itemId)
                .map((item, index) => ({ ...item, no: index + 1 })),
            }
          : tab
      ),
    }));
  },
  
  setActiveTab: (tabId: string | null) => {
    set({ activeTabId: tabId });
  },
    }),
    {
      name: 'study-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

