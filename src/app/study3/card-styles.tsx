'use client';

import { useEffect } from 'react';
import type { StudyCard } from './project-cards';
import { findStudyCard } from './related-lookup';
import { getTocItem } from '../study2/toc';

function splitTopic(topic: string) {
  if (!topic.endsWith(')')) return { head: topic, tail: '' };
  const open = topic.lastIndexOf('(');
  if (open <= 0) return { head: topic, tail: '' };
  return {
    head: topic.slice(0, open).trim(),
    tail: topic.slice(open + 1, -1).replace(/\s*:\s*/g, ': ').trim(),
  };
}

export function ProjectCardSample({
  card,
  onRelated,
  embedded = false,
}: {
  card: StudyCard;
  index: number;
  onRelated?: (tag: string) => void;
  embedded?: boolean;
}) {
  const { head, tail } = splitTopic(card.topic);
  const tags = card.related.split(',').map((item) => item.trim()).filter(Boolean);
  const body = (
    <>
      <h2 className="text-[15px] font-bold leading-6">
        {head}
        {tail && <span className="font-normal"> ({tail})</span>}
      </h2>
      <div className="mt-3 space-y-2 text-[13px] leading-6">
        <p>
          <span className="font-medium">정의 : </span>
          {card.definition}
        </p>
        <p>
          <span className="font-medium">필요성 : </span>
          {card.why}
        </p>
        <p className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">연관 단어 : </span>
          {tags.map((tag) =>
            onRelated ? (
              <button
                key={tag}
                type="button"
                onClick={() => onRelated(tag)}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[12px] leading-5 text-slate-600 hover:bg-slate-200"
              >
                {tag}
              </button>
            ) : (
              <span key={tag} className="rounded-full px-2 py-0.5 text-[12px] leading-5" style={{ background: '#f1f5f9', color: '#475569' }}>
                {tag}
              </span>
            ),
          )}
        </p>
      </div>
    </>
  );

  if (embedded) return <div>{body}</div>;

  return (
    <article
      className="rounded-lg border px-4 py-3.5 shadow-sm"
      style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#1e293b' }}
    >
      {body}
    </article>
  );
}

export function RelatedKeywordPopup({
  tag,
  slug,
  onTag,
  onClose,
}: {
  tag: string;
  slug: string;
  onTag: (tag: string) => void;
  onClose: () => void;
}) {
  const found = findStudyCard(tag, slug);
  const chapter = found ? getTocItem(found.slug)?.label : '';

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${tag} 키워드`}
        className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg border px-4 py-3.5 shadow-sm"
        style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#1e293b' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[12px] text-slate-500">{chapter}</p>
          <button type="button" onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
            닫기
          </button>
        </div>
        {found ? (
          <ProjectCardSample card={found.card} index={0} onRelated={onTag} embedded />
        ) : (
          <>
            <h2 className="text-[15px] font-bold leading-6">{tag}</h2>
            <p className="mt-3 text-[13px] leading-6">이 연관 단어의 키워드 카드는 없습니다.</p>
          </>
        )}
      </div>
    </div>
  );
}
