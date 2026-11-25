'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { StudyCard } from './project-cards';
import { findStudyCard } from './related-lookup';
import { relatedLevel } from './relation';
import { getTocItem } from '../study2/toc';
import { readModes, splitForSpeech, type ReadMode, type SpeechPart } from './speech-text';

function splitTopic(topic: string) {
  if (!topic.endsWith(')')) return { head: topic, tail: '' };
  const open = topic.lastIndexOf('(');
  if (open <= 0) return { head: topic, tail: '' };
  return {
    head: topic.slice(0, open).trim(),
    tail: topic.slice(open + 1, -1).replace(/\s*:\s*/g, ': ').trim(),
  };
}

const spokenMark = { background: '#cffafe', borderRadius: '4px' };

function RelatedMark({ level }: { level: 'up' | 'down' | null }) {
  if (!level) return null;
  const up = level === 'up';
  return (
    <span title={up ? '상위 개념' : '하위 개념'} style={{ color: up ? '#0e7490' : '#64748b' }}>
      {up ? '↑' : '↓'}
    </span>
  );
}

function SpokenChunks({ text, activeIndex }: { text: string; activeIndex: number | null }) {
  return splitForSpeech(text).map((chunk, chunkIndex) => (
    <span key={chunkIndex} style={activeIndex === chunkIndex ? spokenMark : undefined}>
      {chunk}
    </span>
  ));
}

function SpeakMenu({ playing, onPick, onOpenChange }: { playing: boolean; onPick: (mode: ReadMode) => void; onOpenChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const setMenu = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setMenu(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label="음성으로 읽기"
        aria-expanded={open}
        onClick={() => setMenu(!open)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border"
        style={{ borderColor: playing ? '#0891b2' : '#e5e7eb', color: playing ? '#0891b2' : '#64748b', background: '#ffffff' }}
      >
        <Volume2 className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-1 w-28 rounded-lg border bg-white py-1 shadow-md" style={{ borderColor: '#e5e7eb' }}>
          {readModes.map((item) => (
            <button
              key={item.id}
              type="button"
              className="block w-full px-2 py-1 text-left text-[12px] text-slate-700 hover:bg-slate-100"
              onClick={() => {
                setMenu(false);
                onPick(item.id);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectCardSample({
  card,
  index,
  total,
  onRelated,
  embedded = false,
  cardId,
  slug = '',
  speech,
}: {
  card: StudyCard;
  index: number;
  total?: number;
  onRelated?: (tag: string) => void;
  embedded?: boolean;
  cardId?: string;
  slug?: string;
  speech?: {
    playing: boolean;
    activePart: SpeechPart | null;
    chunkIndex: number | null;
    activeTag: string | null;
    onPick: (mode: ReadMode) => void;
  };
}) {
  const { head, tail } = splitTopic(card.topic);
  const tags = card.related.split(',').map((item) => item.trim()).filter(Boolean);
  const [menuOpen, setMenuOpen] = useState(false);
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[15px] font-bold leading-6" style={speech?.activePart === 'title' ? spokenMark : undefined}>
          {head}
          {tail && <span className="font-normal"> ({tail})</span>}
        </h2>
        {speech && (
          <SpeakMenu
            playing={speech.playing}
            onOpenChange={setMenuOpen}
            onPick={(mode) => {
              setMenuOpen(false);
              speech.onPick(mode);
            }}
          />
        )}
      </div>
      <div className="mt-3 space-y-2 text-[13px] leading-6">
        <p>
          <span className="font-medium">정의 : </span>
          <SpokenChunks text={card.definition} activeIndex={speech?.activePart === 'definition' ? speech.chunkIndex : null} />
        </p>
        <p>
          <span className="font-medium">필요성 : </span>
          <SpokenChunks text={card.why} activeIndex={speech?.activePart === 'why' ? speech.chunkIndex : null} />
        </p>
        <p className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium" style={speech?.activePart === 'related' && !speech.activeTag ? spokenMark : undefined}>
            연관 단어 :{' '}
          </span>
          {tags.map((tag) => {
            const level = relatedLevel(card, tag, slug);
            const label = level === 'up' ? `${tag}, 상위 개념` : level === 'down' ? `${tag}, 하위 개념` : tag;
            return onRelated ? (
              <button
                key={tag}
                type="button"
                aria-label={label}
                onClick={() => onRelated(tag)}
                className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[12px] leading-5 text-slate-600 hover:bg-slate-200"
                style={speech?.activeTag === tag ? { boxShadow: '0 0 0 2px #0891b2' } : undefined}
              >
                {tag}
                <RelatedMark level={level} />
              </button>
            ) : (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] leading-5"
                style={{ background: '#f1f5f9', color: '#475569', boxShadow: speech?.activeTag === tag ? '0 0 0 2px #0891b2' : undefined }}
              >
                {tag}
                <RelatedMark level={level} />
              </span>
            );
          })}
        </p>
      </div>
      {typeof total === 'number' && (
        <p className="mt-2 text-right text-[12px] leading-5 text-slate-400">{`${index + 1}/${total}`}</p>
      )}
    </>
  );

  if (embedded) return <div>{body}</div>;

  return (
    <article
      id={cardId}
      className={`scroll-mt-24 rounded-lg border px-4 py-3.5 shadow-sm ${menuOpen ? 'relative z-20' : 'relative'}`}
      style={{
        background: '#ffffff',
        borderColor: speech?.playing ? '#0891b2' : '#e5e7eb',
        color: '#1e293b',
      }}
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
          <ProjectCardSample card={found.card} index={0} slug={found.slug} onRelated={onTag} embedded />
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
