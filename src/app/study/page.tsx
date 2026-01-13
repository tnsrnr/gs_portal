'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Eye, EyeOff, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/common/hooks/useTheme';

interface TopicData {
  id: number;
  topic: string;
  topics_eng?: string;
  topics_loc?: string;
  importance: string;
  category_l1: string;
  category_l2?: string;
  definition?: string;
  cheatsheet?: string;
  additional_info?: string;
}

export default function StudyPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showDefinition, setShowDefinition] = useState<boolean>(false);
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<'random' | 'sequential'>('random');
  const [studiedTopics, setStudiedTopics] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchTopics();
  }, []);

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

  const getCurrentTopic = () => {
    if (topics.length === 0) return null;
    if (studyMode === 'random') {
      const availableTopics = topics.filter(t => !studiedTopics.has(t.id));
      if (availableTopics.length === 0) {
        setStudiedTopics(new Set());
        return topics[Math.floor(Math.random() * topics.length)];
      }
      return availableTopics[Math.floor(Math.random() * availableTopics.length)];
    }
    return topics[currentIndex];
  };

  const handleNext = () => {
    if (studyMode === 'random') {
      const current = getCurrentTopic();
      if (current) {
        setStudiedTopics(prev => new Set([...prev, current.id]));
      }
      setShowDefinition(false);
      setShowCheatsheet(false);
    } else {
      setCurrentIndex(prev => (prev + 1) % topics.length);
      setShowDefinition(false);
      setShowCheatsheet(false);
    }
  };

  const handlePrev = () => {
    if (studyMode === 'sequential') {
      setCurrentIndex(prev => (prev - 1 + topics.length) % topics.length);
      setShowDefinition(false);
      setShowCheatsheet(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setStudiedTopics(new Set());
    setShowDefinition(false);
    setShowCheatsheet(false);
  };

  const currentTopic = getCurrentTopic();
  const progress = topics.length > 0 ? (studiedTopics.size / topics.length) * 100 : 0;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* 레벨 2 패턴 배경 - 학습용 보라색 계열 */}
      <div className="absolute inset-0">
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

      <div className="relative z-10 min-h-[calc(100vh-64px)] p-3 space-y-3">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center gap-4 mb-4">
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
                토픽 학습
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {topics.length > 0 ? `총 ${topics.length}개의 토픽` : '토픽 데이터를 불러오는 중...'}
              </p>
            </div>

            {/* 학습 모드 선택 */}
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setStudyMode('random');
                  handleReset();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  studyMode === 'random' 
                    ? 'bg-purple-600 text-white' 
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                랜덤
              </button>
              <button
                onClick={() => {
                  setStudyMode('sequential');
                  handleReset();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  studyMode === 'sequential' 
                    ? 'bg-purple-600 text-white' 
                    : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                순차
              </button>
            </div>
          </div>

          {/* 학습 진행도 */}
          {topics.length > 0 && studyMode === 'random' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  학습 진행도
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {studiedTopics.size} / {topics.length}
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
              key={currentTopic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-sm border p-6"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="space-y-6">
                {/* 토픽 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                      <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {currentTopic.topic}
                      </h2>
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
                    {studyMode === 'sequential' && (
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {currentIndex + 1} / {topics.length}
                      </span>
                    )}
                  </div>

                  {currentTopic.topics_eng && (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {currentTopic.topics_eng}
                    </p>
                  )}

                  {currentTopic.topics_loc && (
                    <p className="text-base" style={{ color: 'var(--text-primary)' }}>
                      {currentTopic.topics_loc}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {currentTopic.category_l1 && (
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {currentTopic.category_l1}
                      </span>
                    )}
                    {currentTopic.category_l2 && (
                      <span className="px-2 py-1 rounded text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {currentTopic.category_l2}
                      </span>
                    )}
                  </div>
                </div>

                {/* 정의 영역 */}
                {currentTopic.definition && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>정의</h3>
                      <button
                        onClick={() => setShowDefinition(!showDefinition)}
                        className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {showDefinition ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>숨기기</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>보기</span>
                          </>
                        )}
                      </button>
                    </div>
                    {showDefinition && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded"
                        style={{ background: 'var(--bg-tertiary)' }}
                      >
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                          {currentTopic.definition}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* 두음 영역 */}
                {currentTopic.cheatsheet && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>두음</h3>
                      <button
                        onClick={() => setShowCheatsheet(!showCheatsheet)}
                        className="flex items-center gap-1 text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {showCheatsheet ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span>숨기기</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>보기</span>
                          </>
                        )}
                      </button>
                    </div>
                    {showCheatsheet && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded"
                        style={{ background: 'var(--bg-tertiary)' }}
                      >
                        <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                          {currentTopic.cheatsheet}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* 설명 영역 */}
                {currentTopic.additional_info && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>설명</h3>
                    <div className="p-3 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                        {currentTopic.additional_info}
                      </p>
                    </div>
                  </div>
                )}

                {/* 컨트롤 버튼 */}
                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex gap-2">
                    {studyMode === 'sequential' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        className="p-2 rounded-lg border"
                        style={{
                          background: 'var(--bg-tertiary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="p-2 rounded-lg border"
                      style={{
                        background: 'var(--bg-tertiary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{
                      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
                      color: 'white'
                    }}
                  >
                    다음
                    <ChevronRight className="w-5 h-5 inline-block ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p style={{ color: 'var(--text-secondary)' }}>학습할 토픽이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

