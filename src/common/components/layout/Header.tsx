'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuItems } from './menu_config';
// 드래그 앤 드롭 제거 - 단순화
import { useState, useEffect, useRef } from 'react';

function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(' ');
}

import { Settings, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { useTheme } from '@/common/hooks/useTheme';

// 드롭다운 메뉴 아이템 컴포넌트
function MenuItem({ menu, pathname }: { 
  menu: any; 
  pathname: string; 
}) {
  const router = useRouter();
  // 메뉴별 색상 정의 - 원래 색상 유지하면서 은은한 효과만 추가
  const getMenuColor = (menuName: string) => {
    switch (menuName) {
      case 'Overview': return {
        primary: '#3b82f6', // blue - 원래 색상 유지
        secondary: 'rgba(59, 130, 246, 0.1)',
        hover: 'rgba(59, 130, 246, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.12) 100%)'
      };
      case 'My Order': return {
        primary: '#22c55e', // green - 원래 색상 복원
        secondary: 'rgba(34, 197, 94, 0.1)',
        hover: 'rgba(34, 197, 94, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(34, 197, 94, 0.12) 100%)'
      };
      case 'Quotation': return {
        primary: '#9333ea', // purple - 원래 색상 복원
        secondary: 'rgba(147, 51, 234, 0.1)',
        hover: 'rgba(147, 51, 234, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0.12) 100%)'
      };
      case 'Account': return {
        primary: '#f97316', // orange - 원래 색상 복원
        secondary: 'rgba(249, 115, 22, 0.1)',
        hover: 'rgba(249, 115, 22, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.12) 100%)'
      };
      default: return {
        primary: '#6b7280', // gray
        secondary: 'rgba(107, 114, 128, 0.1)',
        hover: 'rgba(107, 114, 128, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.08) 0%, rgba(107, 114, 128, 0.12) 100%)'
      };
    }
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const isActive = pathname === menu.path || (menu.submenu && menu.submenu.some((sub: any) => pathname === sub.path));
  const menuColor = getMenuColor(menu.name);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsHovered(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 호버 시 드롭다운 표시 (서브메뉴가 있는 경우만) - 지연 시간 추가
  useEffect(() => {
    if (menu.submenu && menu.submenu.length > 0) {
      if (isHovered) {
        // 호버 시 즉시 표시
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
        setIsDropdownOpen(true);
      } else {
        // 호버 해제 시 지연 후 숨김
        hoverTimeoutRef.current = setTimeout(() => {
          setIsDropdownOpen(false);
        }, 100); // 100ms 지연
      }
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isHovered, menu.submenu]);

  // 서브메뉴가 있는 경우
  if (menu.submenu && menu.submenu.length > 0) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => {
            // 클릭 시 메인 페이지로 이동
            router.push(menu.path);
          }}
          className="relative flex flex-row items-center gap-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm overflow-hidden backdrop-blur-sm"
          style={{
            background: isActive 
              ? menuColor.gradient
              : 'transparent',
            color: isActive 
              ? menuColor.primary
              : 'var(--text-secondary)',
            boxShadow: isActive 
              ? `0 4px 16px ${menuColor.secondary}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : 'none',
            border: isActive 
              ? `1px solid ${menuColor.secondary}`
              : '1px solid transparent'
          }}
          onMouseEnter={(e) => {
            setIsHovered(true);
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            if (!isActive) {
              e.currentTarget.style.background = menuColor.gradient;
              e.currentTarget.style.color = menuColor.primary;
              e.currentTarget.style.boxShadow = `0 2px 12px ${menuColor.secondary}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`;
              e.currentTarget.style.border = `1px solid ${menuColor.secondary}`;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            // 지연 시간을 두고 호버 상태 해제
            hoverTimeoutRef.current = setTimeout(() => {
              setIsHovered(false);
            }, 60);
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.border = '1px solid transparent';
              e.currentTarget.style.transform = 'translateY(0px)';
            }
          }}
        >
          {/* 미묘한 배경 오버레이 */}
          {isActive && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${menuColor.primary}20 0%, transparent 70%)`
              }}
            />
          )}
          
          <div className="relative z-10 flex items-center gap-x-2">
            {menu.icon && <menu.icon className="w-4 h-4" />}
            <span className="whitespace-nowrap">{menu.name}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isDropdownOpen && (
          <div 
            className="absolute top-full left-0 mt-1 w-48 rounded-xl shadow-2xl z-50 border animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              background: 'var(--bg-dropdown)',
              borderColor: 'var(--border-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onMouseEnter={() => {
              setIsHovered(true);
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
            }}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="p-2">
              {menu.submenu.map((subItem: any, index: number) => {
                const isSubActive = pathname === subItem.path;
                return (
                  <Link
                    key={subItem.path}
                    href={subItem.path}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                    style={{
                      background: isSubActive ? 'var(--bg-tertiary)' : 'transparent',
                      color: isSubActive ? 'var(--text-dropdown)' : 'var(--text-dropdown-secondary)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.background = 'var(--bg-tertiary)';
                        e.currentTarget.style.color = 'var(--text-dropdown)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-dropdown-secondary)';
                      }
                    }}
                  >
                    {subItem.icon && <subItem.icon className="w-5 h-5" />}
                    <div>
                      <div className="font-medium">{subItem.name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-dropdown-secondary)' }}>
                        {subItem.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 일반 메뉴 아이템 - 은은한 그라데이션 효과 추가
  return (
    <Link
      href={menu.path}
      className="relative flex flex-row items-center gap-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm overflow-hidden backdrop-blur-sm"
      style={{
        background: isActive 
          ? menuColor.gradient
          : 'transparent',
        color: isActive 
          ? menuColor.primary
          : 'var(--text-secondary)',
        boxShadow: isActive 
          ? `0 4px 16px ${menuColor.secondary}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : 'none',
        border: isActive 
          ? `1px solid ${menuColor.secondary}`
          : '1px solid transparent'
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        if (!isActive) {
          e.currentTarget.style.background = menuColor.gradient;
          e.currentTarget.style.color = menuColor.primary;
          e.currentTarget.style.boxShadow = `0 2px 12px ${menuColor.secondary}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`;
          e.currentTarget.style.border = `1px solid ${menuColor.secondary}`;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.border = '1px solid transparent';
          e.currentTarget.style.transform = 'translateY(0px)';
        }
      }}
    >
      {/* 미묘한 배경 오버레이 */}
      {isActive && (
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${menuColor.primary}20 0%, transparent 70%)`
          }}
        />
      )}
      
      <div className="relative z-10 flex items-center gap-x-2">
        {menu.icon && <menu.icon className="w-4 h-4" />}
        <span className="whitespace-nowrap">{menu.name}</span>
      </div>
    </Link>
  );
}

// 설정 드롭다운 메뉴 컴포넌트
function SettingsDropdown({ 
  isOpen, 
  onToggle, 
  onClose, 
  handleLogout 
}: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  handleLogout: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-2.5 py-1.5 text-sm rounded-lg transition-colors border"
        style={{
          color: 'var(--text-secondary)',
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border-secondary)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.background = 'var(--bg-card)';
          e.currentTarget.style.borderColor = 'var(--border-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.background = 'var(--bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--border-secondary)';
        }}
        title="설정"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">설정</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 backdrop-blur-md rounded-xl shadow-2xl z-50 border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="p-2 space-y-1">
            {/* 테마 변경 섹션 */}
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
                테마 설정
              </h3>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span>{theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}</span>
              </button>
            </div>

            {/* 구분선 */}
            <div className="border-t" style={{ borderColor: 'var(--border-secondary)' }}></div>

            {/* 로그아웃 섹션 */}
            <div className="px-3 py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors"
                style={{
                  color: 'var(--accent-red)',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-red)';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.opacity = '0.1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--accent-red)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme } = useTheme();

  // 클라이언트 사이드 렌더링 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 페이지 설정 제거 - 단순화

  // 로그인 페이지에서는 헤더를 숨김 (필요시 주석 해제)
  // if (pathname === '/auth') {
  //   return null;
  // }

  const handleLogout = () => {
    // 로그아웃 기능 (필요시 구현)
    console.log('로그아웃');
  };

  // 단순화된 메뉴 표시
  const visibleMenus = menuItems;

  return (
    <header className="backdrop-blur-md shadow-xl border-none z-50 relative" style={{ 
      background: 'var(--bg-primary)' 
    }}>
      <div className="flex justify-between items-center px-3 py-2">
        <div className="flex items-center space-x-4">
          {/* IT학습자료 로고 */}
          <Link href="/">
            <div className="flex items-center gap-2">
              {/* 아이콘 */}
              <div 
                className="relative w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                }}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* 전구 본체 */}
                  <path 
                    d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" 
                    fill="rgba(255, 255, 255, 0.95)"
                  />
                  {/* 회로판/네트워크 패턴 */}
                  <circle cx="9" cy="8" r="1" fill="#60a5fa" />
                  <circle cx="12" cy="7" r="1" fill="#60a5fa" />
                  <circle cx="15" cy="8" r="1" fill="#60a5fa" />
                  <line x1="9" y1="8" x2="12" y2="7" stroke="#60a5fa" strokeWidth="0.5" />
                  <line x1="12" y1="7" x2="15" y2="8" stroke="#60a5fa" strokeWidth="0.5" />
                  <circle cx="10" cy="10" r="0.8" fill="#60a5fa" />
                  <circle cx="14" cy="10" r="0.8" fill="#60a5fa" />
                  <line x1="10" y1="10" x2="14" y2="10" stroke="#60a5fa" strokeWidth="0.5" />
                  {/* 전구 밑부분 */}
                  <rect x="10" y="18" width="4" height="2" rx="1" fill="rgba(255, 255, 255, 0.9)" />
                </svg>
              </div>
              {/* 텍스트 */}
              <div className="flex items-baseline gap-1">
                <span 
                  className="text-lg font-semibold"
                  style={{
                    color: theme === 'dark' ? '#60a5fa' : '#2563eb',
                    fontWeight: 600
                  }}
                >
                  IT
                </span>
                <span 
                  className="text-lg font-medium"
                  style={{
                    color: theme === 'dark' ? '#94a3b8' : '#475569',
                    fontWeight: 500
                  }}
                >
                  학습자료
                </span>
              </div>
            </div>
          </Link>
          {/* 메뉴 네비게이션 - Pill Navigation 스타일 */}
          <div className="flex items-center">
            {/* Pill Navigation Container */}
            <div className="flex items-center p-1 rounded-full border backdrop-blur-md shadow-lg" style={{
              background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
              boxShadow: theme === 'dark' 
                ? '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
              <nav className="flex space-x-1">
                {visibleMenus.map((menu) => (
                  <MenuItem
                    key={menu.path}
                    menu={menu}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
        {/* 우측 버튼들 */}
        <div className="flex items-center space-x-3">
          {/* 설정 드롭다운 */}
          {isClient && (
            <SettingsDropdown
              isOpen={isSettingsOpen}
              onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
              onClose={() => setIsSettingsOpen(false)}
              handleLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
} 