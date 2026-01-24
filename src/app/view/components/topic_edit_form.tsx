'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Save, Tag, Globe, FileText, BookOpen, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/common/hooks/useTheme';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/common/components/ui/dialog';
import { updateTopic } from '../../actions/topics';

// 대분류별 중분류 매핑
const categoryL2Options: Record<string, string[]> = {
  '경영전략': [
    'IT 경영전략',
    'IT 전략 정렬(Business–IT Alignment)',
    '디지털 전환(DX) 전략',
    'IT 거버넌스',
    '성과관리(BSC, KPI)',
    '투자·가치평가(VBM, ROI, EVA)',
    'IT Compliance / 윤리',
    '아웃소싱 전략',
    'EA(Enterprise Architecture)'
  ],
  '소프트웨어': [
    '소프트웨어 공학',
    '개발 방법론(폭포수, 애자일, DevOps)',
    '요구사항 분석',
    '설계(구조/객체지향/컴포넌트)',
    '테스트 / 품질관리',
    '형상관리 / 배포',
    '소프트웨어 아키텍처',
    '재사용 / 프레임워크'
  ],
  '프로젝트관리': [
    '프로젝트 생명주기',
    '범위 / 일정 / 비용 관리',
    '품질 / 자원 / 의사소통 관리',
    '위험 / 조달 관리',
    '이해관계자 관리',
    'PMO',
    'IT 프로젝트 실패 요인',
    '성숙도 모델(CMMI 등)'
  ],
  '디지털서비스': [
    '전자정부 / 디지털 정부',
    '서비스 설계(UX/UI)',
    '웹/모바일 서비스',
    'API / Open API',
    '클라우드 서비스',
    '마이크로서비스(MSA)',
    '데이터 기반 서비스',
    '접근성 / 표준 / 품질'
  ],
  '네트워크': [
    '네트워크 구조(LAN/WAN)',
    'OSI / TCP-IP',
    '라우팅 / 스위칭',
    '무선 네트워크',
    '인터넷 / CDN',
    '네트워크 가상화(SDN/NFV)',
    '성능 / 트래픽 관리',
    '장애 / 이중화'
  ],
  '보안': [
    '정보보호 관리체계(ISMS)',
    '접근통제(인증/인가)',
    '암호기술',
    '네트워크 보안',
    '시스템 보안',
    '애플리케이션 보안',
    '개인정보 보호',
    '침해사고 대응 / 포렌식'
  ],
  '데이터베이스': [
    '데이터 모델링',
    'DB 설계(논리/물리)',
    'SQL / 튜닝',
    '트랜잭션 / 동시성',
    '무결성 / 정합성',
    '분산 DB',
    '데이터웨어하우스',
    '빅데이터 / NoSQL'
  ],
  '인공지능': [
    'AI 개요 / 역사',
    '머신러닝',
    '딥러닝',
    '자연어처리(NLP)',
    '컴퓨터 비전',
    '추천 / 예측 시스템',
    'AI 플랫폼 / MLOps',
    '윤리 / 신뢰성 AI'
  ],
  'CA': [
    '컴퓨터 구조 개요',
    'CPU 구조',
    '메모리 계층',
    '입출력 시스템',
    '병렬 처리',
    '멀티코어 / GPU',
    '성능 평가',
    '임베디드 시스템'
  ],
  'System': [
    '시스템 아키텍처',
    '분산 시스템',
    '클라우드 인프라',
    '고가용성(HA)',
    '확장성 / 성능',
    '장애 관리',
    '시스템 통합(SI)',
    '운영 관리'
  ],
  'OS': [
    '프로세스 / 스레드',
    '스케줄링',
    '메모리 관리',
    '파일 시스템',
    '입출력 관리',
    '가상화',
    '보안 / 보호',
    '리눅스 / 유닉스'
  ],
  '자료구조': [
    '선형 자료구조',
    '비선형 자료구조',
    '트리 / 그래프',
    '해시',
    '정렬 구조',
    '탐색 구조',
    '파일 구조',
    '응용 자료구조'
  ],
  '알고리즘': [
    '알고리즘 설계 기법',
    '정렬 / 탐색',
    '그래프 알고리즘',
    '동적 계획법',
    '탐욕 알고리즘',
    '분할 정복',
    '복잡도 분석',
    '최적화 문제'
  ],
  '통계/확률': [
    '기초 확률',
    '확률 분포',
    '추정 / 검정',
    '회귀 분석',
    '다변량 분석',
    '시계열 분석',
    '통계적 품질관리',
    '데이터 분석 기법'
  ]
};

interface TopicEditFormProps {
  topic: {
    topics?: string;
    topics_eng?: string;
    topics_loc?: string;
    importance: string;
    category_l1: string;
    category_l2?: string;
    category_l3?: string;
    topic: string;
    parent_topic?: string;
    child_topic?: string;
    definition?: string;
    cheatsheet?: string;
    additional_info?: string;
  };
  onClose: () => void;
  onSave?: () => void; // 저장 후 콜백
}

export function TopicEditForm({ topic, onClose, onSave }: TopicEditFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  
  // 변경 전 토픽 이름 저장 (PK 역할)
  const originalTopicName = topic.topic;
  
  const [formData, setFormData] = useState({
    topics: topic.topics || '',
    topics_eng: topic.topics_eng || '',
    topics_loc: topic.topics_loc || '',
    importance: topic.importance || '',
    category_l1: topic.category_l1 || '',
    category_l2: topic.category_l2 || '',
    category_l3: topic.category_l3 || '',
    topic: topic.topic || '',
    parent_topic: topic.parent_topic || '',
    child_topic: topic.child_topic || '',
    definition: topic.definition || '',
    cheatsheet: topic.cheatsheet || '',
    additional_info: topic.additional_info || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // 필수 필드 검증
    if (!formData.topic.trim() || !formData.category_l1.trim() || !formData.importance) {
      alert('필수 항목(약어, 대분류, 중요도)을 입력해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateTopic(originalTopicName, formData);
      if (result.success) {
        alert('저장되었습니다.');
        onClose();
        // 저장 후 콜백 호출 (데이터 새로고침)
        if (onSave) {
          onSave();
        }
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

  return (
    <div className="mx-auto w-full p-3 space-y-2" style={{ maxWidth: 'calc(56rem * 1.2)' }}>
      {/* 토픽 그룹 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
          <span className="text-xl font-semibold px-3" style={{ color: 'var(--text-secondary)' }}>토 픽</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
        </div>
        <div 
          className="p-2 rounded-lg"
          style={{
            background: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'
          }}
        >
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>약어 *</label>
              <div className="relative">
                <Tag className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="약어 *"
                  className={`w-full pl-8 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${!formData.topic.trim() ? 'border-red-500' : ''}`}
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: !formData.topic.trim() ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>영문명</label>
              <div className="relative">
                <Globe className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.topics_eng}
                  onChange={(e) => setFormData({ ...formData, topics_eng: e.target.value })}
                  placeholder="영문명"
                  className="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>한글명</label>
              <div className="relative">
                <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.topics_loc}
                  onChange={(e) => setFormData({ ...formData, topics_loc: e.target.value })}
                  placeholder="한글명"
                  className="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>관련토픽</label>
              <div className="relative">
                <BookOpen className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={formData.child_topic}
                  onChange={(e) => setFormData({ ...formData, child_topic: e.target.value })}
                  placeholder="관련토픽"
                  className="w-full pl-8 pr-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 분류 그룹 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
          <span className="text-xl font-semibold px-3" style={{ color: 'var(--text-secondary)' }}>분 류</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-primary)' }}></div>
        </div>
        <div 
          className="p-2 rounded-lg"
          style={{
            background: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)'
          }}
        >
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-1">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>중요도 *</label>
              <Select value={formData.importance} onValueChange={(value) => setFormData({ ...formData, importance: value })}>
                <SelectTrigger 
                  className={!formData.importance ? 'border-red-500' : ''}
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: !formData.importance ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <SelectValue placeholder="중요도 *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="상">상</SelectItem>
                  <SelectItem value="중">중</SelectItem>
                  <SelectItem value="하">하</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-5">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>대분류 *</label>
              <Select value={formData.category_l1} onValueChange={(value) => {
                setFormData({ ...formData, category_l1: value, category_l2: '' });
              }}>
                <SelectTrigger 
                  className={!formData.category_l1.trim() ? 'border-red-500' : ''}
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: !formData.category_l1.trim() ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <SelectValue placeholder="대분류 *" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryL2Options).map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>중분류</label>
              <Select
                value={formData.category_l2}
                onValueChange={(value) => setFormData({ ...formData, category_l2: value })}
                disabled={!formData.category_l1}
              >
                <SelectTrigger
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <SelectValue placeholder="중분류" />
                </SelectTrigger>
                <SelectContent>
                  {formData.category_l1 && categoryL2Options[formData.category_l1]?.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>{subCategory}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>소분류</label>
              <input
                type="text"
                value={formData.category_l3}
                onChange={(e) => setFormData({ ...formData, category_l3: e.target.value })}
                placeholder="소분류"
                className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 토픽 정의와 두음 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-6 gap-2 mb-2"
      >
        <div className="col-span-5">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>토픽 정의</label>
          <textarea
            value={formData.definition}
            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
            placeholder="토픽 정의"
            rows={3}
            className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
        <div className="col-span-1">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>두음</label>
          <textarea
            value={formData.cheatsheet}
            onChange={(e) => setFormData({ ...formData, cheatsheet: e.target.value })}
            placeholder="두음"
            rows={3}
            className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </motion.div>

      {/* 토픽 설명 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-2"
      >
        <div className="flex items-center gap-2 mb-1">
          <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>토픽 설명</label>
          <button
            type="button"
            onClick={() => setIsDescriptionModalOpen(true)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            style={{ color: 'var(--text-primary)' }}
            title="전체 내용 보기"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <textarea
          value={formData.additional_info}
          onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
          placeholder="토픽 설명"
          rows={8}
          className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        />
      </motion.div>

      {/* 토픽 설명 팝업 */}
      <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
        <DialogContent 
          className="max-w-3xl max-h-[81vh] overflow-hidden flex flex-col"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'var(--border-color)'
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--text-primary)' }}>토픽 설명</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            <div
              className="w-full px-4 py-3 border rounded-lg text-sm whitespace-pre-wrap"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                minHeight: 'calc(81vh - 120px)'
              }}
            >
              {formData.additional_info || <span className="text-gray-400">토픽 설명이 없습니다.</span>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 저장 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex justify-end items-center pt-2 border-t"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className="px-3 py-1.5 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
          style={{
            background: isSaving ? 'var(--bg-tertiary)' : 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            border: '1px solid',
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
        >
          <Save className="w-4 h-4" />
          저장
        </motion.button>
      </motion.div>
    </div>
  );
}

