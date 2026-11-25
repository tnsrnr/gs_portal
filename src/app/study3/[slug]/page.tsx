'use client';

import { useParams } from 'next/navigation';
import { getTocItem } from '../../study2/toc';
import { study3Keywords } from '../keywords';
import { ProjectCardSample } from '../card-styles';
import { study3Cards } from '../cards';
import { Study3ChapterHeader } from '../chapter-header';

export default function Study3KeywordPage() {
  const params = useParams<{ slug: string }>();
  const item = getTocItem(params.slug);
  const keywords = study3Keywords[params.slug] ?? [];
  const cards = study3Cards[params.slug] ?? null;

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <Study3ChapterHeader slug={params.slug} mode="keywords" />

        {!item ? (
          <p style={{ color: 'var(--text-secondary)' }}>없는 목차입니다.</p>
        ) : (
          <div
            className="rounded-2xl border px-4 py-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <p className="text-sm font-semibold text-cyan-700">키워드</p>
            <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              {(cards ? cards.length : keywords.length)}개.
            </p>
            {cards ? (
              <div className="mt-3 flex flex-col gap-3">
                {cards.map((card, index) => (
                  <ProjectCardSample key={`${card.topic}-${index}`} card={card} index={index} />
                ))}
              </div>
            ) : keywords.length === 0 ? (
              <p className="mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                이 목차에 정리된 키워드가 없습니다.
              </p>
            ) : (
              <ol className="mt-6">
                {keywords.map((keyword, index) => (
                  <li
                    key={`${keyword}-${index}`}
                    className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-3 border-b py-2.5 text-[15px] leading-7"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span className="font-semibold text-cyan-700">{index + 1}</span>
                    <span>{keyword}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
