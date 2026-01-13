'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import TabulatorGrid, { TabulatorGridRef, DataType } from '@/common/components/TabulatorGrid';
import "tabulator-tables/dist/css/tabulator.min.css";
import { useTheme } from '@/common/hooks/useTheme';
import { Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { TopicEditForm } from './topic_edit_form';

interface TopicData extends DataType {
  id: number;
  topics?: string; // 토픽(key)
  topics_eng?: string; // 토픽(영문명)
  topics_loc?: string; // 토픽(한글명)
  importance: string; // 중요도 (상, 중, 하)
  category_l1: string; // 대분류
  category_l2?: string; // 중분류
  category_l3?: string; // 소분류
  topic: string; // 토픽 이름
  parent_topic?: string; // 상위 토픽
  child_topic?: string; // 하위 토픽
  definition?: string; // 토픽 정의
  cheatsheet?: string; // 암기용 요약 정보(두음)
  additional_info?: string; // 토픽 설명
}

interface TopicsTableProps {
  data?: TopicData[];
  loading?: boolean;
  onDataUpdate?: () => void; // 데이터 업데이트 콜백
}

export function TopicsTable({ data, loading, onDataUpdate }: TopicsTableProps) {
  const gridRef = useRef<TabulatorGridRef>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null);
  const { theme } = useTheme();

  // 약어 클릭 핸들러
  const handleTopicClick = (rowData: TopicData) => {
    setSelectedTopic(rowData);
    setIsEditModalOpen(true);
  };

  // 글자 크기 줄이기 위한 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .tabulator-small-font .tabulator-cell,
      .tabulator-small-font .tabulator-header-cell {
        font-size: 0.75rem !important;
        padding: 4px 8px !important;
      }
      .tabulator-small-font .tabulator-header-cell {
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 약어 클릭 이벤트 리스너
  useEffect(() => {
    const handleTopicClickEvent = (e: Event) => {
      const customEvent = e as CustomEvent<TopicData>;
      handleTopicClick(customEvent.detail);
    };

    window.addEventListener('topicClick', handleTopicClickEvent as EventListener);
    return () => {
      window.removeEventListener('topicClick', handleTopicClickEvent as EventListener);
    };
  }, []);

  // 테마에 따른 스타일 설정
  const isDark = theme === 'dark';
  const gridTheme = isDark ? 'dark' : 'light';

  // 컬럼 정의 (메모이제이션하여 불필요한 재렌더링 방지)
  const columns = useMemo(() => [
    {
      title: "분류",
      headerHozAlign: "center",
      columns: [
        { 
          title: "ID", 
          field: "id", 
          sorter: "number",
          headerFilter: true,
          headerFilterPlaceholder: "",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 60
        },
        { 
          title: "중요도", 
          field: "importance", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "",
          headerFilterParams: {
            values: { "상": "상", "중": "중", "하": "하" },
            clearable: true
          },
          headerHozAlign: "center",
          hozAlign: "center",
          width: 50,
          formatter: function(cell: any) {
            const value = cell.getValue();
            let color = "";
            
            if (value === "상") {
              color = isDark ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800";
            } else if (value === "중") {
              color = isDark ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-800";
            } else if (value === "하") {
              color = isDark ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800";
            }
            
            return `<span class="py-1 px-2 rounded-full text-xs font-medium ${color}">${value}</span>`;
          }
        },
        { 
          title: "대", 
          field: "category_l1", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "대분류 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 120
        },
        { 
          title: "중", 
          field: "category_l2", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "중분류 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 120
        }
      ]
    },
    {
      title: "토픽",
      headerHozAlign: "center",
      columns: [
        { 
          title: "약어", 
          field: "topic", 
          sorter: "string", 
          headerFilter: true,
          headerFilterPlaceholder: "약어 검색",
          headerFilterLiveFilter: true,
          headerHozAlign: "center",
          hozAlign: "center",
          width: 120,
          formatter: function(cell: any) {
            const value = cell.getValue();
            const linkColor = isDark ? 'text-blue-400' : 'text-blue-600';
            return `<span class="font-medium ${linkColor} cursor-pointer hover:underline">${value || '-'}</span>`;
          },
          cellClick: function(e: any, cell: any) {
            const rowData = cell.getRow().getData();
            // React state 업데이트를 위해 이벤트 사용
            const event = new CustomEvent('topicClick', { detail: rowData });
            window.dispatchEvent(event);
          }
        },
        { 
          title: "영문명", 
          field: "topics_eng", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "영문명 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 150
        },
        { 
          title: "한글명", 
          field: "topics_loc", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "한글명 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 150
        },
        { 
          title: "관련토픽", 
          field: "child_topic", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "관련토픽 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 120,
          formatter: function(cell: any) {
            const value = cell.getValue();
            return value || '-';
          }
        }
      ]
    },
    {
      title: "학습",
      headerHozAlign: "center",
      columns: [
        { 
          title: "정의", 
          field: "definition", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "정의 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 375, // 250 * 1.5 = 375
          formatter: function(cell: any) {
            const value = cell.getValue();
            if (!value) return '-';
            const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
            const truncated = value.length > 50 ? value.substring(0, 50) + '...' : value;
            return `<div class="whitespace-pre-wrap ${textColor}">${truncated}</div>`;
          }
        },
        { 
          title: "두음", 
          field: "cheatsheet", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "두음 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 150, // 75 * 2 = 150
          formatter: function(cell: any) {
            const value = cell.getValue();
            if (!value) return '-';
            const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
            const truncated = value.length > 30 ? value.substring(0, 30) + '...' : value;
            return `<div class="whitespace-pre-wrap ${textColor}">${truncated}</div>`;
          }
        },
        { 
          title: "설명", 
          field: "additional_info", 
          sorter: "string",
          headerFilter: true,
          headerFilterPlaceholder: "설명 검색",
          headerHozAlign: "center",
          hozAlign: "center",
          width: 300,
          formatter: function(cell: any) {
            const value = cell.getValue();
            if (!value) return '-';
            const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
            const truncated = value.length > 60 ? value.substring(0, 60) + '...' : value;
            return `<div class="whitespace-pre-wrap ${textColor}">${truncated}</div>`;
          }
        }
      ]
    }
  ] as any, [isDark]);

  // Tabulator 추가 옵션 (메모이제이션하여 불필요한 재렌더링 방지)
  const additionalOptions = useMemo(() => ({
    movableColumns: true,
    layout: "fitColumns", // fitData 대신 fitColumns 사용
    renderVertical: "basic",
    placeholder: "데이터가 없습니다.",
    placeholderBackground: isDark ? "#1f2937" : "white",
    dataLoaderLoading: "데이터 로딩중...",
    dataLoaderError: "데이터 로드 실패",
    resizableColumns: true,
    responsiveLayout: false,
    theme: gridTheme,
    height: "650px", // 고정 높이 설정 - 헤더와 푸터는 고정, 데이터 영역만 스크롤
    cssClass: "tabulator-small-font", // 작은 글자 크기 클래스 추가
    dataFiltered: function(filters: any) {
      setHasActiveFilters(filters.length > 0);
    }
  }), [gridTheme, isDark]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-blue)' }}></div>
        <span className="ml-2" style={{ color: 'var(--text-secondary)' }}>테이블 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <span style={{ color: 'var(--text-secondary)' }}>데이터가 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col relative" style={{ background: 'transparent', height: '730px', overflow: 'hidden' }}>
      {/* 레벨 2 패턴 배경 */}
      <div className="absolute inset-0">
        {/* 기본 그라데이션 */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.05) 50%, rgba(34, 197, 94, 0.03) 100%)
          `
        }}></div>
        
        {/* 격자 패턴 */}
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* 점 패턴 */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            radial-gradient(circle at 15px 15px, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            radial-gradient(circle at 45px 45px, rgba(147, 51, 234, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 90px 90px',
          backgroundPosition: '0 0, 30px 30px'
        }}></div>
      </div>
      
      <div className="relative z-10 flex flex-col" style={{ height: '100%', overflow: 'hidden' }}>
        {/* 필터 섹션 */}
        <div className="mb-4 rounded-lg border backdrop-blur-sm flex-shrink-0" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          boxShadow: `
            0 8px 32px rgba(59, 130, 246, 0.1),
            0 4px 16px rgba(59, 130, 246, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          borderTop: '3px solid rgba(59, 130, 246, 0.6)',
          height: '10px',
          padding: 0
        }}>
        </div>

        {/* 그리드 테이블 */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'transparent', minHeight: 0 }}>
          <div className="flex-1 overflow-hidden tabulator-small-font" style={{ background: 'transparent' }}>
            <TabulatorGrid
              ref={gridRef}
              data={data}
              columns={columns}
              additionalOptions={additionalOptions}
              className="w-full h-full"
              theme={theme}
              paginationSize={2000}
            />
          </div>
        </div>
      </div>

      {/* 편집 모달 */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent 
          className="max-h-[90vh] overflow-y-auto p-6"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            maxWidth: 'calc(56rem * 1.2)', // max-w-4xl (56rem) * 1.2
            width: 'calc(56rem * 1.2)'
          }}
        >
          {selectedTopic && (
            <TopicEditForm
              topic={selectedTopic}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedTopic(null);
              }}
              onSave={() => {
                // 저장 후 데이터 새로고침
                if (onDataUpdate) {
                  onDataUpdate();
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

