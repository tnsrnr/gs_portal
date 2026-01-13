'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { useTheme } from '@/common/hooks/useTheme';
import { TopicsTable } from './components/topics_table';

interface TopicData {
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

export default function ViewPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [data, setData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/topics');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        console.error('Error fetching topics:', result.error);
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative z-10 min-h-[calc(100vh-64px)] p-3 space-y-3">
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
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              토픽 조회
            </h1>
          </div>
        </div>

        {/* 그리드 테이블 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 mb-6"
          style={{ height: '730px', overflow: 'hidden' }}
        >
          <TopicsTable 
            data={data} 
            loading={loading}
            onDataUpdate={fetchTopics}
          />
        </motion.div>
      </div>
    </div>
  );
}
