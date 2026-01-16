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
  const [showCheatsheet, setShowCheatsheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [studyMode, setStudyMode] = useState<'random' | 'sequential'>('random');
  const [studyPattern, setStudyPattern] = useState<'full' | 'select_definition' | 'find_topic'>('full');
  const [studiedTopics, setStudiedTopics] = useState<Set<number>>(new Set());
  const [choiceCount, setChoiceCount] = useState<number>(3); // 선택지 개수 (2, 3, 5)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [choiceOptions, setChoiceOptions] = useState<TopicData[]>([]);
  const [currentTopicState, setCurrentTopicState] = useState<TopicData | null>(null);

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

  // 선택지 생성 (패턴 2, 3용)
  const generateChoices = (correctTopic: TopicData) => {
    if (studyPattern === 'select_definition') {
      // 정의 선택: 정답 1개 + 오답 (choiceCount - 1)개
      const wrongTopics = topics
        .filter(t => t.id !== correctTopic.id && t.definition)
        .sort(() => Math.random() - 0.5)
        .slice(0, choiceCount - 1);
      const allChoices = [correctTopic, ...wrongTopics].sort(() => Math.random() - 0.5);
      setChoiceOptions(allChoices);
    } else if (studyPattern === 'find_topic') {
      // 토픽명 찾기: 정답 1개 + 오답 (choiceCount - 1)개
      const wrongTopics = topics
        .filter(t => t.id !== correctTopic.id && t.topic)
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
    const topic = getCurrentTopic();
    if (topic) {
      setCurrentTopicState(topic);
      if (topics.length > 0 && (studyPattern === 'select_definition' || studyPattern === 'find_topic')) {
        generateChoices(topic);
      }
    }
  }, [currentIndex, studyMode, studyPattern, choiceCount, topics.length, studiedTopics]);

  const handleNext = () => {
    if (studyMode === 'random') {
      const current = getCurrentTopic();
      if (current) {
        setStudiedTopics(prev => new Set([...prev, current.id]));
      }
      setShowCheatsheet(false);
    } else {
      setCurrentIndex(prev => (prev + 1) % topics.length);
      setShowCheatsheet(false);
    }
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handlePrev = () => {
    if (studyMode === 'sequential') {
      setCurrentIndex(prev => (prev - 1 + topics.length) % topics.length);
      setShowCheatsheet(false);
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

  const handleChoiceSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
    setShowAnswer(true);
    
    // 선택한 답이 정답인지 확인 (저장된 currentTopicState 사용)
    const selectedOption = choiceOptions[index];
    const isCorrect = selectedOption && selectedOption.id === currentTopicState?.id;
    
    // 정답을 클릭한 경우 1초 후 자동으로 다음으로 넘어감
    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  };

  // 저장된 토픽 사용 (랜덤 모드에서 토픽이 바뀌지 않도록)
  const currentTopic = currentTopicState;
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

            {/* 학습 패턴 선택 */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setStudyPattern('full');
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyPattern === 'full' 
                      ? 'bg-purple-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  전체보기
                </button>
                <button
                  onClick={() => {
                    setStudyPattern('select_definition');
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyPattern === 'select_definition' 
                      ? 'bg-purple-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  정의 선택
                </button>
                <button
                  onClick={() => {
                    setStudyPattern('find_topic');
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyPattern === 'find_topic' 
                      ? 'bg-purple-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  토픽 찾기
                </button>
              </div>
              {/* 선택지 개수 설정 (패턴 2, 3일 때만) */}
              {(studyPattern === 'select_definition' || studyPattern === 'find_topic') && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>선택지:</span>
                  {[2, 3, 5].map(count => (
                    <button
                      key={count}
                      onClick={() => {
                        setChoiceCount(count);
                        handleReset();
                      }}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        choiceCount === count
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {count}개
                    </button>
                  ))}
                </div>
              )}
              {/* 학습 모드 선택 */}
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setStudyMode('random');
                    handleReset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyMode === 'random' 
                      ? 'bg-blue-600 text-white' 
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    studyMode === 'sequential' 
                      ? 'bg-blue-600 text-white' 
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  순차
                </button>
              </div>
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
                borderColor: 'var(--border-color)',
                minHeight: '600px',
                height: '600px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="space-y-6 flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(600px - 80px)' }}>
                {/* 토픽 정보 - 패턴에 따라 다르게 표시 */}
                {(studyPattern === 'full' || studyPattern === 'select_definition') && (
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
                )}

                {/* 패턴 3: 토픽 정보 숨김 */}
                {studyPattern === 'find_topic' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          토픽 찾기
                        </h2>
                      </div>
                      {studyMode === 'sequential' && (
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {currentIndex + 1} / {topics.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 패턴별 컨텐츠 표시 */}
                {studyPattern === 'full' && (
                  <>
                    {/* 정의 영역 - 항상 표시 */}
                    {currentTopic.definition && (
                      <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>정의</h3>
                        <div className="p-3 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                            {currentTopic.definition}
                          </p>
                        </div>
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
                        const isCorrect = option.id === currentTopic.id;
                        const isSelected = selectedAnswer === index;
                        return (
                          <button
                            key={option.id}
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
                {studyPattern === 'find_topic' && currentTopic.definition && (
                  <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>정의</h3>
                    <div className="p-3 rounded mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                        {currentTopic.definition}
                      </p>
                    </div>
                    <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      위 정의에 해당하는 토픽을 선택하세요
                    </h3>
                    <div className="space-y-2">
                      {choiceOptions.map((option, index) => {
                        const isCorrect = option.id === currentTopic.id;
                        const isSelected = selectedAnswer === index;
                        return (
                          <button
                            key={option.id}
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
              </div>
              {/* 컨트롤 버튼 - 고정 위치 */}
              <div className="flex items-center justify-between pt-4 border-t mt-4 flex-shrink-0" style={{ borderColor: 'var(--border-color)' }}>
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

