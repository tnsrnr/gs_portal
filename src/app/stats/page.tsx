'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, User, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '@/common/hooks/useTheme';

interface StudySession {
  id: number;
  student_name: string;
  category_l1: string;
  study_duration: number;
  study_date: string;
  created_at: string;
}

interface Statistics {
  totalSessions: number;
  totalStudyTime: number; // 초 단위
  averageStudyTime: number; // 초 단위
  students: string[];
  categories: string[];
  sessionsByCategory: { [key: string]: number };
  sessionsByStudent: { [key: string]: number };
  studyTimeByCategory: { [key: string]: number };
  studyTimeByStudent: { [key: string]: number };
  sessionsByDate: { [key: string]: number };
}

export default function StatsPage() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [filterStudent, setFilterStudent] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      calculateStatistics();
    }
  }, [sessions, filterStudent, filterCategory, filterDateFrom, filterDateTo]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/study-sessions');
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.data);
      } else {
        console.error('Failed to fetch sessions:', result.error);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    // 필터 적용
    let filteredSessions = sessions;
    
    if (filterStudent !== 'all') {
      filteredSessions = filteredSessions.filter(s => s.student_name === filterStudent);
    }
    
    if (filterCategory !== 'all') {
      filteredSessions = filteredSessions.filter(s => s.category_l1 === filterCategory);
    }
    
    if (filterDateFrom) {
      filteredSessions = filteredSessions.filter(s => s.study_date >= filterDateFrom);
    }
    
    if (filterDateTo) {
      filteredSessions = filteredSessions.filter(s => s.study_date <= filterDateTo);
    }

    const totalSessions = filteredSessions.length;
    const totalStudyTime = filteredSessions.reduce((sum, s) => sum + s.study_duration, 0);
    const averageStudyTime = totalSessions > 0 ? Math.floor(totalStudyTime / totalSessions) : 0;

    const students = Array.from(new Set(filteredSessions.map(s => s.student_name)));
    const categories = Array.from(new Set(filteredSessions.map(s => s.category_l1)));

    const sessionsByCategory: { [key: string]: number } = {};
    const sessionsByStudent: { [key: string]: number } = {};
    const studyTimeByCategory: { [key: string]: number } = {};
    const studyTimeByStudent: { [key: string]: number } = {};
    const sessionsByDate: { [key: string]: number } = {};

    filteredSessions.forEach(session => {
      // 카테고리별 통계
      sessionsByCategory[session.category_l1] = (sessionsByCategory[session.category_l1] || 0) + 1;
      studyTimeByCategory[session.category_l1] = (studyTimeByCategory[session.category_l1] || 0) + session.study_duration;

      // 학습자별 통계
      sessionsByStudent[session.student_name] = (sessionsByStudent[session.student_name] || 0) + 1;
      studyTimeByStudent[session.student_name] = (studyTimeByStudent[session.student_name] || 0) + session.study_duration;

      // 날짜별 통계
      sessionsByDate[session.study_date] = (sessionsByDate[session.study_date] || 0) + 1;
    });

    setStatistics({
      totalSessions,
      totalStudyTime,
      averageStudyTime,
      students,
      categories,
      sessionsByCategory,
      sessionsByStudent,
      studyTimeByCategory,
      studyTimeByStudent,
      sessionsByDate,
    });
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p style={{ color: 'var(--text-secondary)' }}>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p style={{ color: 'var(--text-secondary)' }}>데이터가 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            학습 통계
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            학습 세션 데이터를 기반으로 한 통계 정보입니다.
          </p>
        </div>

        {/* 필터 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg border"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                학습자
              </label>
              <select
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">전체</option>
                {statistics.students.map(student => (
                  <option key={student} value={student}>{student}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                대분류
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">전체</option>
                {statistics.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                시작일
              </label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                종료일
              </label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <BarChart3 className="w-6 h-6" style={{ color: 'rgba(59, 130, 246, 1)' }} />
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              총 학습 세션
            </h3>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {statistics.totalSessions.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: 'rgba(16, 185, 129, 1)' }} />
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              총 학습 시간
            </h3>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatTime(statistics.totalStudyTime)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: 'rgba(168, 85, 247, 1)' }} />
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              평균 학습 시간
            </h3>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatTime(statistics.averageStudyTime)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <User className="w-6 h-6" style={{ color: 'rgba(239, 68, 68, 1)' }} />
              </div>
            </div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
              학습자 수
            </h3>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {statistics.students.length}
            </p>
          </motion.div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 카테고리별 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BookOpen className="w-5 h-5" />
              카테고리별 통계
            </h2>
            <div className="space-y-3">
              {Object.entries(statistics.sessionsByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-primary)' }}>{category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {count}회 ({formatTime(statistics.studyTimeByCategory[category])})
                      </span>
                      <div className="w-32 h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(count / statistics.totalSessions) * 100}%`,
                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* 학습자별 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-lg border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)'
            }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User className="w-5 h-5" />
              학습자별 통계
            </h2>
            <div className="space-y-3">
              {Object.entries(statistics.sessionsByStudent)
                .sort((a, b) => b[1] - a[1])
                .map(([student, count]) => (
                  <div key={student} className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-primary)' }}>{student}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {count}회 ({formatTime(statistics.studyTimeByStudent[student])})
                      </span>
                      <div className="w-32 h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(count / statistics.totalSessions) * 100}%`,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.8) 100%)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
