'use client';

import { useParams } from 'next/navigation';
import { getTocItem } from '../../study2/toc';
import { ChapterRoadmap } from '../chapter-roadmap';
import { Study3ChapterHeader } from '../chapter-header';

export default function Study3ChapterPage() {
  const params = useParams<{ slug: string }>();
  const item = getTocItem(params.slug);

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-7xl px-3 py-8">
        <Study3ChapterHeader slug={params.slug} mode="roadmap" />
        {!item ? <p style={{ color: 'var(--text-secondary)' }}>없는 목차입니다.</p> : <ChapterRoadmap slug={params.slug} />}
      </div>
    </div>
  );
}
