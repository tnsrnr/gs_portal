'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Folder } from 'lucide-react';
import { studyToc } from '../study2/toc';
import { study3Keywords } from './keywords';

export default function Study3IndexPage() {
  const router = useRouter();

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm"
          style={{
            background: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          홈
        </button>

        <div
          className="overflow-hidden rounded-2xl border shadow-sm"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="border-b px-5 py-4" style={{ borderColor: 'var(--border-color)' }}>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              학습 목차
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              로드맵과 키워드를 따로 엽니다.
            </p>
          </div>
          <ul>
            {studyToc.map((item) => {
              const count = study3Keywords[item.slug]?.length ?? 0;
              return (
                <li
                  key={item.slug}
                  className="flex flex-wrap items-center gap-2 border-b px-5 py-3 last:border-b-0"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <Folder className="h-5 w-5 shrink-0 text-cyan-600" fill="currentColor" />
                  <span className="min-w-0 flex-1 text-[15px]">{item.label}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {count}개
                  </span>
                  <button
                    type="button"
                    onClick={() => router.push(`/study3/${item.slug}/roadmap`)}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium text-cyan-700"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    로드맵
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/study3/${item.slug}`)}
                    className="rounded-full border px-3 py-1.5 text-sm font-medium text-cyan-700"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    키워드
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
