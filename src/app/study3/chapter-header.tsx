'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTocItem } from '../study2/toc';

export function Study3ChapterHeader({ slug, mode }: { slug: string; mode: 'keywords' | 'roadmap' }) {
  const router = useRouter();
  const item = getTocItem(slug);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => router.push('/study3')}
        className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm"
        style={{
          background: 'var(--bg-tertiary)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <ArrowLeft className="h-4 w-4" />
        학습 목차
      </button>
      {item && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {item.label}
          </h1>
          <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--border-color)' }}>
            <button
              type="button"
              onClick={() => router.push(`/study3/${slug}`)}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: mode === 'roadmap' ? '#0891b2' : 'transparent',
                color: mode === 'roadmap' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              로드맵
            </button>
            <button
              type="button"
              onClick={() => router.push(`/study3/${slug}/keywords`)}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: mode === 'keywords' ? '#0891b2' : 'transparent',
                color: mode === 'keywords' ? '#ffffff' : 'var(--text-secondary)',
              }}
            >
              키워드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
