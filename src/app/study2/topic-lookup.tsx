'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/common/hooks/useTheme';

export type TopicBrief = {
  topic: string;
  topics_eng: string;
  definition: string;
};

let cached: Map<string, TopicBrief[]> | null = null;
let inflight: Promise<Map<string, TopicBrief[]>> | null = null;

function buildIndex(rows: Array<Partial<TopicBrief>>) {
  const map = new Map<string, TopicBrief[]>();
  for (const row of rows) {
    const topic = String(row.topic ?? '').trim();
    const key = topic.toLowerCase();
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push({
      topic,
      topics_eng: String(row.topics_eng ?? '').trim(),
      definition: String(row.definition ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
    });
    map.set(key, list);
  }
  return map;
}

export function useTopicIndex() {
  const [index, setIndex] = useState<Map<string, TopicBrief[]>>(() => cached ?? new Map());

  useEffect(() => {
    if (cached) {
      setIndex(cached);
      return;
    }
    if (!inflight) {
      inflight = fetch('/api/topics?slim=1')
        .then((response) => response.json())
        .then((body) => {
          const map = body?.success && Array.isArray(body.data) ? buildIndex(body.data) : new Map<string, TopicBrief[]>();
          cached = map;
          return map;
        })
        .catch(() => {
          inflight = null;
          return new Map<string, TopicBrief[]>();
        });
    }
    let alive = true;
    inflight.then((map) => {
      if (alive) setIndex(map);
    });
    return () => {
      alive = false;
    };
  }, []);

  return index;
}

export function TopicPopup({
  keyword,
  items,
  zoom,
  onClose,
}: {
  keyword: string;
  items: TopicBrief[];
  zoom: number;
  onClose: () => void;
}) {
  const { isDark } = useTheme();
  const english = items.find((item) => item.topics_eng)?.topics_eng ?? '';

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${keyword} 정의`}
        className="relative max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-5 shadow-xl"
        style={{
          background: isDark ? '#1e293b' : '#ffffff',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          zoom,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="min-w-0 whitespace-nowrap text-lg font-bold">
            {keyword}
            {english && items.length === 1 ? ` (${english})` : ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full px-2 py-1 text-sm"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="닫기"
          >
            닫기
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={`${item.topic}-${index}`}>
              {items.length > 1 && (
                <p className="text-sm font-bold">
                  {keyword}
                  {item.topics_eng ? ` (${item.topics_eng})` : ''}
                </p>
              )}
              <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                {item.definition || '등록된 정의 없음'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
