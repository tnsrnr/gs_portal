'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff, RotateCcw, ChevronLeft, ChevronRight, Edit, Save, X, Table2, Plus, ClipboardPaste } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/common/hooks/useTheme';
import { Dialog, DialogContent } from '@/common/components/ui/dialog';
import { TopicEditForm } from '@/app/view/components/topic_edit_form';
import { updateTopic } from '@/app/actions/topics';
import { Textarea } from '@/common/components/ui/textarea';

interface TopicData {
  topic: string;
  topics_eng?: string;
  topics_loc?: string;
  importance: string;
  category_l1: string;
  category_l2?: string;
  definition?: string;
  cheatsheet?: string;
  additional_info?: string;
  viewtable?: string;
}

export default function StudyPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<'random' | 'sequential'>('sequential');
  const [studyPattern, setStudyPattern] = useState<'full' | 'select_definition' | 'find_topic'>('full');
  const [studiedTopics, setStudiedTopics] = useState<Set<string>>(new Set());
  const [choiceCount, setChoiceCount] = useState<number>(3); // 선택지 개수 (2, 3, 5)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [choiceOptions, setChoiceOptions] = useState<TopicData[]>([]);
  const [currentTopicState, setCurrentTopicState] = useState<TopicData | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(true); // 설정 화면 표시 여부
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 선택된 대분류 (멀티 선택)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false); // 수정 모달 표시 여부
  const [editingField, setEditingField] = useState<string | null>(null); // 편집 중인 필드명
  const [editValue, setEditValue] = useState<string>(''); // 편집 중인 값
  const [isSaving, setIsSaving] = useState<boolean>(false); // 저장 중 여부
  const editInputRef = useRef<HTMLTextAreaElement>(null);
  
  // 학습 세션 추적
  const [studyStartTime, setStudyStartTime] = useState<Date | null>(null); // 학습 시작 시간
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false); // 완료 모달 표시
  
  // 비교표 팝업
  const [showTableModal, setShowTableModal] = useState<boolean>(false); // 비교표 팝업 표시
  const [tableRows, setTableRows] = useState<number>(3); // 표 행 개수
  const [tableCols, setTableCols] = useState<number>(4); // 표 열 개수
  const [tableData, setTableData] = useState<string[][]>([]); // 표 데이터

  useEffect(() => {
    fetchTopics();
  }, []);

  // 헤더의 "학습" 버튼 클릭 시 설정 화면으로 돌아가기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href="/study"]');
      if (link && pathname === '/study' && !showSettings) {
        e.preventDefault();
        e.stopPropagation();
        setShowSettings(true);
        window.history.pushState({}, '', '/study');
      }
    };
    
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname, showSettings]);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/topics');
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        setTopics(result.data);
        setCurrentIndex(0);
        setStudiedTopics(new Set());
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  // 대분류 목록 추출
  const categories = Array.from(new Set(topics.map(t => t.category_l1).filter(Boolean))).sort();

  // 각 대분류별 토픽 수 계산
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = topics.filter(t => t.category_l1 === category).length;
    return acc;
  }, {} as Record<string, number>);

  // 선택된 대분류에 따라 필터링된 토픽
  const filteredTopics = selectedCategories.length === 0 || selectedCategories.length === categories.length
    ? topics 
    : topics.filter(t => selectedCategories.includes(t.category_l1));

  const getCurrentTopic = () => {
    if (filteredTopics.length === 0) return null;
    if (studyMode === 'random') {
      const availableTopics = filteredTopics.filter(t => !studiedTopics.has(t.topic));
      if (availableTopics.length === 0) {
        setStudiedTopics(new Set());
        return filteredTopics[Math.floor(Math.random() * filteredTopics.length)];
      }
      return availableTopics[Math.floor(Math.random() * availableTopics.length)];
    }
    return filteredTopics[currentIndex];
  };

  // 선택지 생성 (패턴 2, 3용)
  const generateChoices = (correctTopic: TopicData) => {
    if (studyPattern === 'select_definition') {
      // 정의 선택: 정답 1개 + 오답 (choiceCount - 1)개
      const wrongTopics = filteredTopics
        .filter(t => t.topic !== correctTopic.topic && t.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, choiceCount - 1);
      const allChoices = [correctTopic, ...wrongTopics].sort(() => Math.random() - 0.5);
      setChoiceOptions(allChoices);
    } else if (studyPattern === 'find_topic') {
      // 토픽명 찾기: 정답 1개 + 오답 (choiceCount - 1)개
      const wrongTopics = filteredTopics
        .filter(t => t.topic !== correctTopic.topic && t.topic)
        .sort(() => Math.random() - 0.5)
        .slice(0, choiceCount - 1);
      const allChoices = [correctTopic, ...wrongTopics].sort(() => Math.random() - 0.5);
      setChoiceOptions(allChoices);
    }
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // 현재 토픽 선택 및 저장
  useEffect(() => {
    if (!showSettings) {
      if (filteredTopics.length > 0) {
        const topic = getCurrentTopic();
        if (topic) {
          setCurrentTopicState(topic);
          if ((studyPattern === 'select_definition' || studyPattern === 'find_topic')) {
            generateChoices(topic);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, studyMode, studyPattern, choiceCount, studiedTopics, showSettings, selectedCategories, topics]);

  const handleNext = () => {
    if (studyMode === 'random') {
      const current = getCurrentTopic();
      if (current) {
        setStudiedTopics(prev => {
          const newSet = new Set(prev);
          newSet.add(current.topic);
          return newSet;
        });
      }
      setShowCheatsheet(false);
      
      // 학습 완료 체크
      const availableTopics = filteredTopics.filter(t => !studiedTopics.has(t.topic));
      if (availableTopics.length === 0) {
        handleStudyComplete();
        return;
      }
    } else {
      if (currentIndex < filteredTopics.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // 마지막 토픽 완료
        handleStudyComplete();
        return;
      }
      setShowCheatsheet(false);
    }
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // 학습 완료 처리
  const handleStudyComplete = () => {
    if (!studyStartTime) return;
    
    setShowCompletionModal(true);
  };

  const handlePrev = () => {
    if (studyMode === 'sequential') {
      // 첫 번째 토픽이면 이전으로 가지 않음
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setShowCheatsheet(false);
      }
    }
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setStudiedTopics(new Set());
    setShowCheatsheet(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // 비교표 팝업 열기
  const openTableModal = () => {
    setShowTableModal(true);
    // 기본 3행 4열로 초기화
    const initialData: string[][] = [];
    for (let i = 0; i < tableRows; i++) {
      initialData.push(Array(tableCols).fill(''));
    }
    setTableData(initialData);
  };

  // 표 크기 변경 시 데이터 초기화
  useEffect(() => {
    if (showTableModal) {
      setTableData(prev => {
        const newData: string[][] = [];
        for (let i = 0; i < tableRows; i++) {
          if (prev[i]) {
            // 기존 데이터가 있으면 유지하고, 부족한 열은 빈 문자열로 채움
            const row = [...prev[i]];
            while (row.length < tableCols) {
              row.push('');
            }
            newData.push(row.slice(0, tableCols));
          } else {
            newData.push(Array(tableCols).fill(''));
          }
        }
        return newData;
      });
    }
  }, [tableRows, tableCols, showTableModal]);

  // 표 데이터 변경
  const updateTableCell = (row: number, col: number, value: string) => {
    const newData = [...tableData];
    if (!newData[row]) {
      newData[row] = Array(tableCols).fill('');
    }
    newData[row][col] = value;
    setTableData(newData);
  };

  // 실제 텍스트 너비 측정 함수 (Canvas 사용)
  const measureTextWidth = (text: string, fontSize: number = 14, fontFamily: string = 'system-ui, -apple-system, sans-serif'): number => {
    // Canvas를 사용해서 정확한 텍스트 너비 측정
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * 8; // 폴백
    
    context.font = `${fontSize}px ${fontFamily}`;
    return context.measureText(text).width;
  };

  // 마크다운 테이블 생성
  const generateMarkdownTable = (): string => {
    if (tableData.length === 0) return '';
    
    // 현재 토픽명 가져오기
    const currentTopic = getCurrentTopic();
    const topicName = currentTopic?.topic || '비교표';
    
    // 모든 행을 정규화 (열 개수 맞추기)
    const normalizedData: string[][] = [];
    const maxCols = Math.max(...tableData.map(row => row.length), tableCols);
    
    tableData.forEach(row => {
      const filledRow = [...row];
      while (filledRow.length < maxCols) {
        filledRow.push('');
      }
      normalizedData.push(filledRow.slice(0, maxCols));
    });
    
    if (normalizedData.length === 0) return '';
    
    // 각 열의 최대 텍스트 너비 계산 (실제 DOM 측정)
    const colWidths: number[] = [];
    const fontSize = 14; // 기본 폰트 크기
    const fontFamily = 'system-ui, -apple-system, sans-serif';
    
    for (let col = 0; col < maxCols; col++) {
      let maxWidth = 0;
      normalizedData.forEach(row => {
        const cellText = String(row[col] || '').trim();
        if (cellText) {
          const width = measureTextWidth(cellText, fontSize, fontFamily);
          maxWidth = Math.max(maxWidth, width);
        }
      });
      // 최소 너비는 빈 셀 기준으로 설정
      colWidths[col] = Math.max(measureTextWidth(' ', fontSize, fontFamily) * 3, maxWidth);
    }
    
    // 셀 내용을 패딩하는 함수 (실제 너비 측정 기반)
    const padCell = (text: string, targetWidth: number): string => {
      const trimmed = String(text || '').trim();
      if (!trimmed) return ' '.repeat(Math.ceil(targetWidth / measureTextWidth(' ', fontSize, fontFamily)));
      
      const currentWidth = measureTextWidth(trimmed, fontSize, fontFamily);
      const spaceWidth = measureTextWidth(' ', fontSize, fontFamily);
      const paddingCount = Math.max(0, Math.ceil((targetWidth - currentWidth) / spaceWidth));
      
      return trimmed + ' '.repeat(paddingCount);
    };
    
    let markdown = '\n';
    
    // 표 제목 추가
    markdown += `[${topicName} 비교표]\n\n`;
    
    // 고정 구분선 길이 (135자)
    const separatorLine = '-'.repeat(135) + '\n';
    
    // 헤더 구분: 이중선 + 헤더 + 엔터 + 이중선
    const doubleLine = '='.repeat(80) + '\n';
    const headerRow = normalizedData[0] || [];
    
    markdown += doubleLine; // 이중선
    markdown += ' ' + headerRow.map((cell, idx) => padCell(cell, colWidths[idx])).join(' | ') + ' \n'; // 헤더
    markdown += '\n'; // 엔터 (빈 줄)
    markdown += doubleLine; // 이중선
    
    // 나머지 행들 (각 행 사이에 대시 구분선 추가, 앞뒤 파이프 제거)
    for (let i = 1; i < normalizedData.length; i++) {
      const row = normalizedData[i] || [];
      markdown += ' ' + row.map((cell, idx) => padCell(cell, colWidths[idx])).join(' | ') + ' \n';
      // 마지막 행이 아니면 대시 구분선 추가 (파이프 없이)
      if (i < normalizedData.length - 1) {
        markdown += separatorLine;
      }
    }
    
    // 맨 아래 구분선
    markdown += separatorLine;
    
    return markdown;
  };

  // 엑셀 붙여넣기 처리
  const handlePasteFromExcel = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert('클립보드에 데이터가 없습니다.');
        return;
      }
      
      // 탭과 줄바꿈으로 데이터 파싱
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) {
        alert('붙여넣을 데이터가 없습니다.');
        return;
      }
      
      const parsedData: string[][] = [];
      let maxCols = 0;
      
      lines.forEach(line => {
        // 탭으로 구분 (탭이 없으면 공백으로 구분 시도)
        const cells = line.includes('\t') 
          ? line.split('\t').map(cell => cell.trim())
          : line.split(/\s{2,}/).map(cell => cell.trim()); // 연속된 공백으로 구분
        
        if (cells.length > 0) {
          parsedData.push(cells);
          maxCols = Math.max(maxCols, cells.length);
        }
      });
      
      if (parsedData.length === 0) {
        alert('데이터를 파싱할 수 없습니다.');
        return;
      }
      
      // 행/열 개수 자동 조정
      setTableRows(parsedData.length);
      setTableCols(maxCols);
      
      // 데이터 채우기 (부족한 열은 빈 문자열로 채움)
      const filledData = parsedData.map(row => {
        const filledRow = [...row];
        while (filledRow.length < maxCols) {
          filledRow.push('');
        }
        return filledRow.slice(0, maxCols);
      });
      
      setTableData(filledData);
      alert(`${parsedData.length}행 ${maxCols}열 데이터가 붙여넣기 되었습니다.`);
    } catch (error) {
      console.error('Paste error:', error);
      alert('붙여넣기 중 오류가 발생했습니다. 클립보드 접근 권한을 확인해주세요.');
    }
  };

  // 비교표 적용
  const applyTable = () => {
    const currentTopic = getCurrentTopic();
    if (!currentTopic) return;
    
    const markdownTable = generateMarkdownTable();
    const currentValue = currentTopic.viewtable || '';
    // 기존 값과 표 사이를 "한 줄"만 띄우기
    const normalizedCurrent = currentValue ? currentValue.replace(/\n+$/, '\n') : '';
    const normalizedTable = markdownTable.replace(/^\n+/, '\n');
    const newValue = normalizedCurrent + normalizedTable;
    
    // viewtable 편집 모드로 전환
    startEdit('viewtable', newValue);
    setShowTableModal(false);
  };

  // 인라인 편집 시작
  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  // 인라인 편집 취소
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // 인라인 편집 저장
  const saveEdit = async () => {
    if (!currentTopic || !editingField) return;

    setIsSaving(true);
    try {
      const updateData: Partial<TopicData> = {};
      updateData[editingField as keyof TopicData] = editValue as any;

      const result = await updateTopic(currentTopic.topic, updateData);
      if (result.success) {
        // 로컬 상태 업데이트
        setCurrentTopicState(prev => prev ? { ...prev, [editingField]: editValue } : null);
        // 전체 토픽 목록도 업데이트
        setTopics(prev => prev.map(t => 
          t.topic === currentTopic.topic ? { ...t, [editingField]: editValue } : t
        ));
        setEditingField(null);
        setEditValue('');
      } else {
        alert(`저장 실패: ${result.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  // 엔터키 처리
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    // Escape 키로 편집 취소
    if (e.key === 'Escape') {
      cancelEdit();
      return;
    }

    // textarea 필드에서 Ctrl+Enter로 저장
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      saveEdit();
      return;
    }

    // input 필드에서 Enter 키는 기본 동작 허용 (저장하지 않음)
    // textarea 필드에서 Enter 키는 줄바꿈 (기본 동작)
    // 저장은 명시적으로 저장 버튼을 클릭하거나 Ctrl+Enter 사용
  };

  const handleChoiceSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
    setShowAnswer(true);
    
    // 선택한 답이 정답인지 확인 (저장된 currentTopicState 사용)
    const selectedOption = choiceOptions[index];
    const isCorrect = selectedOption && selectedOption.topic === currentTopicState?.topic;
    
    // 정답을 클릭한 경우 1초 후 자동으로 다음으로 넘어감
    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  };

  // 저장된 토픽 사용 (랜덤 모드에서 토픽이 바뀌지 않도록)
  const currentTopic = currentTopicState;
  const progress = filteredTopics.length > 0 ? (studiedTopics.size / filteredTopics.length) * 100 : 0;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ 
        background: 'var(--bg-primary)',
        paddingTop: '64px',
        zIndex: 0
      }}
    >
      {/* 레벨 2 패턴 배경 - 학습용 보라색 계열 */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        {/* 기본 그라데이션 - 보라색 계열 */}
        <div className="absolute inset-0" style={{
          background: `
            linear-gradient(135deg, rgba(147, 51, 234, 0.06) 0%, rgba(168, 85, 247, 0.08) 50%, rgba(139, 92, 246, 0.06) 100%)
          `
        }}></div>
        
        {/* 격자 패턴 */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `
            linear-gradient(rgba(147, 51, 234, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* 점 패턴 */}
        <div className="absolute inset-0 opacity-35" style={{
          backgroundImage: `
            radial-gradient(circle at 20px 20px, rgba(147, 51, 234, 0.25) 1.5px, transparent 1.5px),
            radial-gradient(circle at 60px 60px, rgba(168, 85, 247, 0.25) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '80px 80px, 120px 120px',
          backgroundPosition: '0 0, 40px 40px'
        }}></div>
        
        {/* 원형 패턴 */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 3%),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 3%),
            radial-gradient(circle at 20% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 2%),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 2%)
          `,
          backgroundSize: '300px 300px, 400px 400px, 200px 200px, 250px 250px',
          backgroundPosition: '0% 0%, 100% 100%, 30% 70%, 70% 30%'
        }}></div>
      </div>

      <div className="relative min-h-[calc(100vh-64px)] p-3 space-y-3" style={{ zIndex: 0 }}>
        <div className="mx-auto" style={{ maxWidth: 'calc(56rem * 1.2)' }}>
          {/* 설정 화면 */}
          {showSettings ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                minHeight: '500px'
              }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/')}
                  className="p-3 rounded-full transition-colors border backdrop-blur-sm"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    학습 설정
                  </h1>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    학습 방식을 선택하고 시작하세요
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* 학습 방식 선택 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    학습 방식
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStudyPattern('full')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        studyPattern === 'full' 
                          ? 'bg-purple-600 text-white' 
                          : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      정의학습
                    </button>
                    <button
                      onClick={() => setStudyPattern('select_definition')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        studyPattern === 'select_definition' 
                          ? 'bg-purple-600 text-white' 
                          : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      정의 선택
                    </button>
                    <button
                      onClick={() => setStudyPattern('find_topic')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        studyPattern === 'find_topic' 
                          ? 'bg-purple-600 text-white' 
                          : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      토픽선택
                    </button>
                  </div>
                </div>

                {/* 대분류 선택 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      대분류
                    </h3>
                    <button
                      onClick={() => {
                        if (selectedCategories.length === categories.length) {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories([...categories]);
                        }
                      }}
                      className="text-sm px-3 py-1 rounded-lg border"
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {selectedCategories.length === categories.length ? '전체 해제' : '전체 선택'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      const count = categoryCounts[category] || 0;
                      return (
                        <button
                          key={category}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCategories(prev => prev.filter(c => c !== category));
                            } else {
                              setSelectedCategories(prev => [...prev, category]);
                            }
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white' 
                              : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {category} ({count})
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                    선택된 대분류: {selectedCategories.length === 0 ? '없음' : selectedCategories.length === categories.length ? '전체' : selectedCategories.join(', ')} ({filteredTopics.length}개)
                  </p>
                </div>

                {/* 학습 모드 선택 및 선택지 개수 설정 */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      학습모드 :
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setStudyMode('sequential')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          studyMode === 'sequential' 
                            ? 'bg-green-600 text-white' 
                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        순차
                      </button>
                      <button
                        onClick={() => setStudyMode('random')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          studyMode === 'random' 
                            ? 'bg-green-600 text-white' 
                            : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        랜덤
                      </button>
                    </div>
                    {/* 선택지 개수 설정 (패턴 2, 3일 때만) */}
                    {(studyPattern === 'select_definition' || studyPattern === 'find_topic') && (
                      <>
                        <span className="text-sm mx-2" style={{ color: 'var(--text-secondary)' }}>|</span>
                        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                          선택지 :
                        </span>
                        <div className="flex gap-2">
                          {[2, 3, 5].map(count => (
                            <button
                              key={count}
                              onClick={() => setChoiceCount(count)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                choiceCount === count
                                  ? 'bg-orange-600 text-white'
                                  : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {count}개
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 시작하기 버튼 */}
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (filteredTopics.length > 0) {
                        setShowSettings(false);
                        setCurrentIndex(0);
                        setStudiedTopics(new Set());
                        // 학습 시작 시간 기록
                        setStudyStartTime(new Date());
                      }
                    }}
                    disabled={filteredTopics.length === 0}
                    className="w-full px-6 py-3 rounded-lg font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: filteredTopics.length === 0 
                        ? 'var(--bg-tertiary)' 
                        : 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)'
                    }}
                  >
                    {filteredTopics.length === 0 ? '선택된 대분류에 토픽이 없습니다' : '학습 시작하기'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
          {/* 학습 진행도 */}
          {filteredTopics.length > 0 && studyMode === 'random' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  학습 진행도
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {studiedTopics.size} / {filteredTopics.length}
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)' }}
                />
              </div>
            </div>
          )}


          {/* 학습 카드 */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-blue)' }}></div>
            </div>
          ) : currentTopic ? (
            <motion.div
              key={currentTopic.topic}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                minHeight: '800px',
                height: '800px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 0
              }}
            >
              <div className="space-y-6 flex-1 overflow-y-auto pr-2" style={{ maxHeight: '800px' }}>
                {/* 토픽 정보 - 패턴에 따라 다르게 표시 */}
                {(studyPattern === 'full' || studyPattern === 'select_definition') && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        {editingField === 'topic' ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              ref={editInputRef as any}
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              className="flex-1 px-3 py-1 rounded border text-xl font-bold"
                              style={{
                                background: 'var(--bg-card)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                              disabled={isSaving}
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={saveEdit}
                              disabled={isSaving}
                              className="p-1 rounded"
                              style={{ color: 'var(--accent-blue)' }}
                            >
                              <Save className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="p-1 rounded"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ) : (
                          <h2 
                            className="text-xl font-bold cursor-pointer hover:opacity-70 transition-opacity" 
                            style={{ color: 'var(--text-primary)' }}
                            onDoubleClick={() => startEdit('topic', currentTopic.topic)}
                            title="더블클릭하여 수정"
                          >
                            {currentTopic.topic}
                          </h2>
                        )}
                        {currentTopic.importance && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            currentTopic.importance === '상' ? 'bg-red-100 text-red-800' :
                            currentTopic.importance === '중' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {currentTopic.importance}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {currentTopic.category_l1 && (
                          <span className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                            {currentTopic.category_l1}{currentTopic.category_l2 ? `->${currentTopic.category_l2}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {(currentTopic.topics_loc || currentTopic.topics_eng) && (
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {currentTopic.topics_loc && currentTopic.topics_eng 
                          ? `${currentTopic.topics_loc} / ${currentTopic.topics_eng}`
                          : currentTopic.topics_loc || currentTopic.topics_eng}
                      </p>
                    )}
                  </div>
                )}

                {/* 패턴 3: 토픽 정보 숨김 */}
                {studyPattern === 'find_topic' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          토픽선택
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsEditModalOpen(true)}
                          className="p-2 rounded-lg border transition-colors"
                          style={{
                            background: 'var(--bg-tertiary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-card)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        {currentTopic.category_l1 && (
                          <span className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                            {currentTopic.category_l1}
                          </span>
                        )}
                        {studyMode === 'sequential' && (
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {currentIndex + 1} / {filteredTopics.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 패턴별 컨텐츠 표시 */}
                {studyPattern === 'full' && (
                  <>
                    {/* 정의 영역 - 항상 표시 */}
                    {currentTopic.definition !== undefined && (
                      <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>정의</h3>
                        {editingField === 'definition' ? (
                          <div className="space-y-2">
                            <Textarea
                              ref={editInputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              className="w-full min-h-[120px]"
                              style={{
                                background: 'var(--bg-card)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                              disabled={isSaving}
                            />
                            <div className="flex gap-2 justify-end">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={saveEdit}
                                disabled={isSaving}
                                className="px-3 py-1 rounded flex items-center gap-1 text-sm"
                                style={{
                                  background: 'var(--accent-blue)',
                                  color: 'white'
                                }}
                              >
                                <Save className="w-3 h-3" />
                                저장
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={cancelEdit}
                                disabled={isSaving}
                                className="px-3 py-1 rounded flex items-center gap-1 text-sm border"
                                style={{
                                  background: 'var(--bg-tertiary)',
                                  borderColor: 'var(--border-color)',
                                  color: 'var(--text-secondary)'
                                }}
                              >
                                <X className="w-3 h-3" />
                                취소
                              </motion.button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="p-3 rounded cursor-pointer hover:opacity-70 transition-opacity" 
                            style={{ background: 'var(--bg-tertiary)' }}
                            onDoubleClick={() => startEdit('definition', currentTopic.definition || '')}
                            title="더블클릭하여 수정"
                          >
                            <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                              {currentTopic.definition || '(정의 없음)'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* 패턴 2: 정의 선택 */}
                {studyPattern === 'select_definition' && currentTopic.definition && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      다음 중 올바른 정의를 선택하세요
                    </h3>
                    <div className="space-y-2">
                      {choiceOptions.map((option, index) => {
                        const isCorrect = option.topic === currentTopic.topic;
                        const isSelected = selectedAnswer === index;
                        return (
                          <button
                            key={option.topic}
                            onClick={() => handleChoiceSelect(index)}
                            disabled={showAnswer}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              showAnswer
                                ? isCorrect
                                  ? 'bg-green-100 border-green-500'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-100 border-red-500'
                                  : 'bg-gray-100 border-gray-300'
                                : isSelected
                                ? 'bg-purple-100 border-purple-500'
                                : 'bg-white border-gray-300 hover:border-purple-300'
                            }`}
                            style={{
                              background: showAnswer
                                ? isCorrect
                                  ? 'rgba(34, 197, 94, 0.1)'
                                  : isSelected && !isCorrect
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'var(--bg-tertiary)'
                                : isSelected
                                ? 'rgba(147, 51, 234, 0.1)'
                                : 'var(--bg-card)',
                              borderColor: showAnswer
                                ? isCorrect
                                  ? '#22c55e'
                                  : isSelected && !isCorrect
                                  ? '#ef4444'
                                  : 'var(--border-color)'
                                : isSelected
                                ? '#9333ea'
                                : 'var(--border-color)'
                            }}
                          >
                            <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                              {option.definition}
                            </p>
                            {showAnswer && isCorrect && (
                              <span className="text-xs font-medium text-green-600 mt-2 block">✓ 정답</span>
                            )}
                            {showAnswer && isSelected && !isCorrect && (
                              <span className="text-xs font-medium text-red-600 mt-2 block">✗ 오답</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 패턴 3: 토픽 찾기 */}
                {studyPattern === 'find_topic' && currentTopic.definition !== undefined && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>정의</h3>
                    {editingField === 'definition' ? (
                      <div className="space-y-2 mb-4">
                        <Textarea
                          ref={editInputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full min-h-[120px]"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                          }}
                          disabled={isSaving}
                        />
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm"
                            style={{
                              background: 'var(--accent-blue)',
                              color: 'white'
                            }}
                          >
                            <Save className="w-3 h-3" />
                            저장
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm border"
                            style={{
                              background: 'var(--bg-tertiary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <X className="w-3 h-3" />
                            취소
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="p-3 rounded mb-4 cursor-pointer hover:opacity-70 transition-opacity" 
                        style={{ background: 'var(--bg-tertiary)' }}
                        onDoubleClick={() => startEdit('definition', currentTopic.definition || '')}
                        title="더블클릭하여 수정"
                      >
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                          {currentTopic.definition || '(정의 없음)'}
                        </p>
                      </div>
                    )}
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      위 정의에 해당하는 토픽을 선택하세요
                    </h3>
                    <div className="space-y-2">
                      {choiceOptions.map((option, index) => {
                        const isCorrect = option.topic === currentTopic.topic;
                        const isSelected = selectedAnswer === index;
                        return (
                          <button
                            key={option.topic}
                            onClick={() => handleChoiceSelect(index)}
                            disabled={showAnswer}
                            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                              showAnswer
                                ? isCorrect
                                  ? 'bg-green-100 border-green-500'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-100 border-red-500'
                                  : 'bg-gray-100 border-gray-300'
                                : isSelected
                                ? 'bg-purple-100 border-purple-500'
                                : 'bg-white border-gray-300 hover:border-purple-300'
                            }`}
                            style={{
                              background: showAnswer
                                ? isCorrect
                                  ? 'rgba(34, 197, 94, 0.1)'
                                  : isSelected && !isCorrect
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'var(--bg-tertiary)'
                                : isSelected
                                ? 'rgba(147, 51, 234, 0.1)'
                                : 'var(--bg-card)',
                              borderColor: showAnswer
                                ? isCorrect
                                  ? '#22c55e'
                                  : isSelected && !isCorrect
                                  ? '#ef4444'
                                  : 'var(--border-color)'
                                : isSelected
                                ? '#9333ea'
                                : 'var(--border-color)'
                            }}
                          >
                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {option.topic}
                            </p>
                            {option.topics_loc && (
                              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                {option.topics_loc}
                              </p>
                            )}
                            {showAnswer && isCorrect && (
                              <span className="text-xs font-medium text-green-600 mt-2 block">✓ 정답</span>
                            )}
                            {showAnswer && isSelected && !isCorrect && (
                              <span className="text-xs font-medium text-red-600 mt-2 block">✗ 오답</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 설명 영역 */}
                {currentTopic.additional_info !== undefined && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>설명</h3>
                      {currentTopic.cheatsheet && (
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-70 transition-opacity"
                          style={{ 
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-primary)'
                          }}
                          onDoubleClick={() => startEdit('cheatsheet', currentTopic.cheatsheet || '')}
                          title="더블클릭하여 수정"
                        >
                          {currentTopic.cheatsheet}
                        </span>
                      )}
                    </div>
                    {editingField === 'cheatsheet' && (
                      <div className="mb-4 p-3 rounded border" style={{ 
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)'
                      }}>
                        <div className="space-y-2">
                          <Textarea
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full min-h-[80px]"
                            style={{
                              background: 'var(--bg-card)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-primary)'
                            }}
                            disabled={isSaving}
                          />
                          <div className="flex gap-2 justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={saveEdit}
                              disabled={isSaving}
                              className="px-3 py-1 rounded flex items-center gap-1 text-sm"
                              style={{
                                background: 'var(--accent-blue)',
                                color: 'white'
                              }}
                            >
                              <Save className="w-3 h-3" />
                              저장
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="px-3 py-1 rounded flex items-center gap-1 text-sm border"
                              style={{
                                background: 'var(--bg-tertiary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <X className="w-3 h-3" />
                              취소
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}
                    {editingField === 'additional_info' ? (
                      <div className="space-y-2">
                        <Textarea
                          ref={editInputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                            minHeight: '300px',
                            height: '300px'
                          }}
                          disabled={isSaving}
                        />
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm"
                            style={{
                              background: 'var(--accent-blue)',
                              color: 'white'
                            }}
                          >
                            <Save className="w-3 h-3" />
                            저장
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm border"
                            style={{
                              background: 'var(--bg-tertiary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <X className="w-3 h-3" />
                            취소
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="p-3 rounded cursor-pointer hover:opacity-70 transition-opacity" 
                        style={{ background: 'var(--bg-tertiary)' }}
                        onDoubleClick={() => startEdit('additional_info', currentTopic.additional_info || '')}
                        title="더블클릭하여 수정"
                      >
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                          {currentTopic.additional_info || '(설명 없음)'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 비교표 영역 (맨 마지막) - viewtable에 내용이 있거나, 팝업에서 적용 후 편집 중일 때 표시 */}
                {((currentTopic.viewtable !== undefined && currentTopic.viewtable !== null && currentTopic.viewtable !== '') || editingField === 'viewtable') && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>비교표</h3>
                    {editingField === 'viewtable' ? (
                      <div className="space-y-2">
                        <Textarea
                          ref={editInputRef}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                            minHeight: '300px',
                            height: '300px'
                          }}
                          disabled={isSaving}
                        />
                        <div className="flex gap-2 justify-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm"
                            style={{
                              background: 'var(--accent-blue)',
                              color: 'white'
                            }}
                          >
                            <Save className="w-3 h-3" />
                            저장
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEdit}
                            disabled={isSaving}
                            className="px-3 py-1 rounded flex items-center gap-1 text-sm border"
                            style={{
                              background: 'var(--bg-tertiary)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            <X className="w-3 h-3" />
                            취소
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="p-3 rounded cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ background: 'var(--bg-tertiary)' }}
                        onDoubleClick={() => startEdit('viewtable', currentTopic.viewtable || '')}
                        title="더블클릭하여 수정"
                      >
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                          {currentTopic.viewtable}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* 컨트롤 버튼 - 고정 위치 */}
              <div className="flex items-center justify-between gap-2 pt-4 border-t mt-4 flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
                {/* 왼쪽: 수정 버튼 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditModalOpen(true)}
                  className="p-2 rounded-lg border transition-colors"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                  title="수정"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
                
                {/* 가운데: X/X 표시 */}
                {studyMode === 'sequential' && (
                  <span className="text-sm absolute left-1/2 transform -translate-x-1/2" style={{ color: 'var(--text-secondary)' }}>
                    {currentIndex + 1} / {filteredTopics.length}
                  </span>
                )}
                
                {/* 오른쪽: 이전/다음 버튼 */}
                <div className="flex items-center gap-2 ml-auto">
                  {studyMode === 'sequential' && (
                    <motion.button
                      whileHover={currentIndex > 0 ? { scale: 1.02 } : {}}
                      whileTap={currentIndex > 0 ? { scale: 0.98 } : {}}
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      className="px-4 py-2 rounded-lg font-medium border transition-colors"
                      style={{
                        background: currentIndex === 0 ? 'var(--bg-tertiary)' : 'var(--bg-card)',
                        borderColor: 'var(--border-color)',
                        color: currentIndex === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
                        opacity: currentIndex === 0 ? 0.5 : 1,
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (currentIndex > 0) {
                          e.currentTarget.style.background = 'var(--bg-tertiary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentIndex > 0) {
                          e.currentTarget.style.background = 'var(--bg-card)';
                        }
                      }}
                    >
                      <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                      이전
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="px-4 py-2 rounded-lg font-medium border transition-colors"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-card)';
                    }}
                  >
                    다음
                    <ChevronRight className="w-4 h-4 inline-block ml-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p style={{ color: 'var(--text-secondary)' }}>학습할 토픽이 없습니다.</p>
            </div>
          )}

          {/* 비교표 추가 버튼 (좌측 하단) */}
          {!showSettings && currentTopic && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={openTableModal}
              className="fixed bottom-6 left-6 z-50 p-4 rounded-full shadow-lg border"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                borderColor: 'var(--border-color)',
                color: 'white'
              }}
              title="비교표 추가"
            >
              <Table2 className="w-6 h-6" />
            </motion.button>
          )}

          {/* 비교표 팝업 */}
          <Dialog open={showTableModal} onOpenChange={setShowTableModal}>
            <DialogContent 
              className="p-6 max-w-4xl h-[80vh] flex flex-col"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              {/* 고정 헤더 영역 */}
              <div className="flex-shrink-0 mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  비교표 추가
                </h2>
                
                {/* 표 크기 설정 - 고정 위치 */}
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      행 개수
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={tableRows}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 2;
                        setTableRows(newValue);
                      }}
                      className="w-20 px-3 py-2 rounded-lg border"
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      열 개수
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={tableCols}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 2;
                        setTableCols(newValue);
                      }}
                      className="w-20 px-3 py-2 rounded-lg border"
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div className="flex-1" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePasteFromExcel}
                    className="px-4 py-2 rounded-lg font-medium border flex items-center gap-2"
                    style={{
                      background: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    title="엑셀/클립보드에서 데이터 붙여넣기 (Ctrl+V)"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    엑셀 붙여넣기
                  </motion.button>
                </div>
              </div>

              {/* 스크롤 가능한 콘텐츠 영역 */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">

                {/* 표 입력 영역 - 스크롤 가능 */}
                <div 
                  className="border rounded-lg p-4 overflow-x-auto overflow-y-auto" 
                  style={{ 
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    maxHeight: '300px',
                    minHeight: '100px'
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData('text');
                    if (text) {
                      // 탭과 줄바꿈으로 데이터 파싱
                      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                      if (lines.length === 0) return;
                      
                      const parsedData: string[][] = [];
                      let maxCols = 0;
                      
                      lines.forEach(line => {
                        const cells = line.includes('\t') 
                          ? line.split('\t').map(cell => cell.trim())
                          : line.split(/\s{2,}/).map(cell => cell.trim());
                        
                        if (cells.length > 0) {
                          parsedData.push(cells);
                          maxCols = Math.max(maxCols, cells.length);
                        }
                      });
                      
                      if (parsedData.length > 0) {
                        setTableRows(parsedData.length);
                        setTableCols(maxCols);
                        
                        const filledData = parsedData.map(row => {
                          const filledRow = [...row];
                          while (filledRow.length < maxCols) {
                            filledRow.push('');
                          }
                          return filledRow.slice(0, maxCols);
                        });
                        
                        setTableData(filledData);
                      }
                    }
                  }}
                >
                  {(() => {
                    // 각 열의 최대 너비 계산 (한글 고려)
                    const calculateTextWidth = (text: string): number => {
                      return Array.from(text).reduce((acc, char) => {
                        return acc + (char.charCodeAt(0) > 127 ? 2 : 1);
                      }, 0);
                    };
                    
                    const colMaxWidths: number[] = [];
                    for (let col = 0; col < tableCols; col++) {
                      let maxWidth = 0;
                      tableData.forEach(row => {
                        const cellValue = String(row[col] || '').trim();
                        const width = calculateTextWidth(cellValue);
                        maxWidth = Math.max(maxWidth, width);
                      });
                      // 최소 5자, 최대 30자
                      colMaxWidths[col] = Math.max(5, Math.min(maxWidth, 30));
                    }
                    
                    // 모든 열의 최대 너비 중 최대값 찾기
                    const globalMaxWidth = Math.max(...colMaxWidths, 10);
                    
                    // 각 열의 고정 너비 계산 (한글 고려하여 더 정확하게)
                    const columnWidth = Math.max(150, globalMaxWidth * 10 + 60); // 최소 150px, 한글 고려하여 여유있게
                    
                    return (
                      <table 
                        className="border-collapse" 
                        style={{ 
                          tableLayout: 'fixed',
                          width: `${columnWidth * tableCols}px`,
                          minWidth: `${columnWidth * tableCols}px`
                        }}
                      >
                        <colgroup>
                          {Array.from({ length: tableCols }).map((_, colIndex) => (
                            <col 
                              key={colIndex} 
                              style={{ 
                                width: `${columnWidth}px`,
                                minWidth: `${columnWidth}px`,
                                maxWidth: `${columnWidth}px`
                              }}
                            />
                          ))}
                        </colgroup>
                        <tbody>
                          {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Array.from({ length: tableCols }).map((_, colIndex) => (
                                <td 
                                  key={colIndex} 
                                  className="p-2 border" 
                                  style={{ 
                                    borderColor: 'var(--border-color)',
                                    width: `${columnWidth}px`,
                                    minWidth: `${columnWidth}px`,
                                    maxWidth: `${columnWidth}px`
                                  }}
                                >
                                  <input
                                    type="text"
                                    value={tableData[rowIndex]?.[colIndex] || ''}
                                    onChange={(e) => updateTableCell(rowIndex, colIndex, e.target.value)}
                                    className="w-full px-2 py-1 rounded border text-sm"
                                    style={{
                                      background: 'var(--bg-card)',
                                      borderColor: 'var(--border-color)',
                                      color: 'var(--text-primary)',
                                      width: '100%',
                                      boxSizing: 'border-box'
                                    }}
                                    placeholder={`${rowIndex === 0 ? '헤더' : '데이터'}`}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>

                {/* 미리보기 */}
                <div className="border rounded-lg p-4 overflow-x-auto" style={{ 
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)'
                }}>
                  <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    미리보기
                  </h3>
                  <div className="text-xs font-mono whitespace-pre overflow-x-auto" style={{ 
                    color: 'var(--text-secondary)',
                    minWidth: '100%',
                    width: 'max-content'
                  }}>
                    {generateMarkdownTable() || '(표를 입력하세요)'}
                  </div>
                </div>

              </div>

              {/* 고정 버튼 영역 */}
              <div className="flex-shrink-0 pt-4 border-t flex gap-2 justify-end" style={{ borderColor: 'var(--border-color)' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTableModal(false)}
                  className="px-4 py-2 rounded-lg font-medium border"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  취소
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={applyTable}
                  className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)'
                  }}
                >
                  적용
                </motion.button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 수정 모달 */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent 
              className="max-h-[90vh] overflow-y-auto p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                maxWidth: 'calc(56rem * 1.2)',
                width: 'calc(56rem * 1.2)'
              }}
            >
              {currentTopic && (
                <TopicEditForm
                  topic={currentTopic}
                  onClose={() => {
                    setIsEditModalOpen(false);
                  }}
                  onSave={(updatedTopic, originalTopicName) => {
                    // 저장 후 학습 상태(인덱스/진행도) 초기화 없이 로컬 데이터만 갱신
                    setTopics(prev =>
                      prev.map(t =>
                        t.topic === originalTopicName ? { ...t, ...updatedTopic } : t
                      )
                    );

                    // 현재 토픽 상태도 갱신 (토픽명이 바뀌는 경우 포함)
                    setCurrentTopicState(prev =>
                      prev && prev.topic === originalTopicName ? { ...prev, ...updatedTopic } : prev
                    );

                    // 랜덤 모드 진행도 set에 토픽명이 들어있다면 치환
                    if (updatedTopic?.topic && updatedTopic.topic !== originalTopicName) {
                      setStudiedTopics(prev => {
                        if (!prev.has(originalTopicName)) return prev;
                        const next = new Set(prev);
                        next.delete(originalTopicName);
                        next.add(updatedTopic.topic);
                        return next;
                      });
                    }

                    setIsEditModalOpen(false);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* 학습 완료 모달 */}
          <Dialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
            <DialogContent 
              className="p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                maxWidth: '500px'
              }}
            >
              <StudyCompletionForm
                studyStartTime={studyStartTime}
                selectedCategories={selectedCategories}
                filteredTopics={filteredTopics}
                onClose={() => {
                  setShowCompletionModal(false);
                  setShowSettings(true);
                  setStudyStartTime(null);
                }}
                onSave={async (data) => {
                  try {
                    const response = await fetch('/api/study-sessions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(data),
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                      setShowCompletionModal(false);
                      setShowSettings(true);
                      setStudyStartTime(null);
                      alert('학습 세션이 저장되었습니다.');
                    } else {
                      alert(`저장 실패: ${result.error || '알 수 없는 오류'}`);
                    }
                  } catch (error) {
                    console.error('Error saving study session:', error);
                    alert('저장 중 오류가 발생했습니다.');
                  }
                }}
              />
            </DialogContent>
          </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 학습 완료 폼 컴포넌트
function StudyCompletionForm({
  studyStartTime,
  selectedCategories,
  filteredTopics,
  onClose,
  onSave
}: {
  studyStartTime: Date | null;
  selectedCategories: string[];
  filteredTopics: TopicData[];
  onClose: () => void;
  onSave: (data: { student_name: string; category_l1: string; study_duration: number; study_date: string }) => void;
}) {
  // 총 학습 시간 계산
  const calculateStudyDuration = () => {
    if (!studyStartTime) return 0;
    
    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - studyStartTime.getTime()) / 1000);
    
    return Math.max(0, totalDuration); // 음수 방지
  };

  // 대분류명 자동 설정
  const getDefaultCategory = () => {
    if (selectedCategories.length > 0) {
      return selectedCategories[0];
    }
    if (filteredTopics.length > 0) {
      return filteredTopics[0].category_l1;
    }
    return '전체';
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    studentName: 'ADMIN',
    category_l1: getDefaultCategory(),
    studyDuration: Math.floor(calculateStudyDuration() / 60), // 분 단위로 변환
    studyDate: getTodayDate(), // 학습일자 (오늘 날짜 기본값)
  });

  // 학습 시간 실시간 업데이트
  useEffect(() => {
    if (studyStartTime) {
      const interval = setInterval(() => {
        const duration = calculateStudyDuration();
        setFormData(prev => ({
          ...prev,
          studyDuration: Math.floor(duration / 60)
        }));
      }, 1000); // 1초마다 업데이트

      return () => clearInterval(interval);
    }
  }, [studyStartTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 초 단위로 변환
    const submitData = {
      student_name: formData.studentName,
      category_l1: formData.category_l1,
      study_duration: formData.studyDuration * 60,
      study_date: formData.studyDate,
    };
    
    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          학습 완료 🎉
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          학습 정보를 확인하고 저장하세요.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            학습자명
          </label>
          <input
            type="text"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            학습목록 (대분류)
          </label>
          <input
            type="text"
            value={formData.category_l1}
            onChange={(e) => setFormData({ ...formData, category_l1: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            총 학습 시간 (분)
          </label>
          <input
            type="number"
            value={formData.studyDuration}
            onChange={(e) => setFormData({ ...formData, studyDuration: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            학습일자
          </label>
          <input
            type="date"
            value={formData.studyDate}
            onChange={(e) => setFormData({ ...formData, studyDate: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            required
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-medium border"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          취소
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg font-medium text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)'
          }}
        >
          확인하기
        </motion.button>
      </div>
    </form>
  );
}
