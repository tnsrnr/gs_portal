'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Roadmap } from './roadmaps';
import type { StrategyWord } from './strategy-words';

export function RoadmapView({
  roadmap,
  terms,
  words,
  isDark,
}: {
  roadmap: Roadmap;
  terms?: Roadmap;
  words?: StrategyWord[];
  isDark: boolean;
}) {
  const [voice, setVoice] = useState<'plain' | 'terms' | 'words'>('plain');
  const current = voice === 'terms' && terms ? terms : roadmap;
  const showingWords = voice === 'words' && !!words?.length;
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <article
      className="rounded-2xl border px-5 py-6 sm:px-8"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
    >
      {terms && (
        <div className="mb-4 flex w-fit rounded-full border p-1" style={{ borderColor: 'var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setVoice('plain')}
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={{
              background: voice === 'plain' ? '#b45309' : 'transparent',
              color: voice === 'plain' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            말로 풀기
          </button>
          <button
            type="button"
            onClick={() => setVoice('terms')}
            className="rounded-full px-3 py-1.5 text-sm font-medium"
            style={{
              background: voice === 'terms' ? '#b45309' : 'transparent',
              color: voice === 'terms' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            실제 용어
          </button>
          {words && words.length > 0 && (
            <button
              type="button"
              onClick={() => setVoice('words')}
              className="rounded-full px-3 py-1.5 text-sm font-medium"
              style={{
                background: voice === 'words' ? '#b45309' : 'transparent',
                color: voice === 'words' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              영어 단어
            </button>
          )}
        </div>
      )}
      {showingWords && words && (
        <div>
          <p className="text-sm font-semibold text-amber-600">영어 단어</p>
          <h2 className="mt-1 text-3xl font-bold">{roadmap.title.replace(/ 로드맵$/, '')} 영어 단어</h2>
          <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
            많이 나온 순입니다. 앞 목차에 이미 나온 단어는 빼었습니다. 괄호 안은 읽는 법과 뜻이고, 오른쪽은 횟수, 아래는 그 단어가 들어 있는 키워드입니다.
            {words.some((item) => item.count === 0)
              ? ' 맨 아래 0회는 본문에 영어 철자가 없고 약어 안에만 들어가는 단어입니다.'
              : ''}
          </p>
          <dl className="mt-6">
            {words.map((item, index) => (
              <div key={item.word}>
                {item.count === 0 && words[index - 1]?.count !== 0 && (
                  <h3 className="mb-1 mt-8 text-sm font-bold text-amber-600">약어 안에만 들어가는 단어</h3>
                )}
              <div
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b py-2 text-[15px] leading-7"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <dt className="font-semibold">
                  {item.word}{' '}
                  <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    ({item.reading}, {item.meaning})
                  </span>
                </dt>
                <dd className="font-semibold text-amber-700">{item.count}회</dd>
                <dd className="col-span-2 text-sm leading-6" style={{ color: 'var(--text-primary)' }}>
                  {item.examples.join(' · ')}
                </dd>
              </div>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!showingWords && (
      <>
      <p className="text-sm font-semibold text-amber-600">{current.subtitle}</p>
      <h2 className="mt-1 text-3xl font-bold">{current.title}</h2>
      <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
        {current.lead}
      </p>

      <div
        className="mt-6 flex flex-wrap items-center gap-x-1.5 gap-y-2 rounded-2xl px-4 py-4"
        style={{ background: isDark ? 'rgba(251, 191, 36, 0.08)' : '#fffbeb' }}
      >
        {current.steps.map((step, index) => (
          <span key={step.id} className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => go(step.id)}
              className="rounded-full px-3 py-1 text-xs font-bold"
              style={{
                background: isDark ? 'rgba(180, 83, 9, 0.85)' : '#b45309',
                color: '#fff',
              }}
            >
              {index + 1}. {step.label}
            </button>
            {index < current.steps.length - 1 && (
              <span aria-hidden className="text-sm font-bold text-amber-600">
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <ol className="relative mt-8">
        {current.steps.map((step, index) => {
          const last = index === current.steps.length - 1;
          return (
            <li key={step.id} id={step.id} className="relative scroll-mt-24 pb-8 pl-14">
              {!last && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-9 bottom-1 w-0.5"
                  style={{ background: isDark ? 'rgba(251, 191, 36, 0.45)' : '#fcd34d' }}
                />
              )}
              <span
                className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: '#b45309', boxShadow: '0 0 0 4px rgba(252, 211, 77, 0.35)' }}
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-1 text-[15px] leading-8">{step.text}</p>
              <p className="mt-2 text-sm leading-7 text-amber-700">{step.bridge}</p>
            </li>
          );
        })}
      </ol>

      {current.next && (
        <Link
          href={current.next.href}
          className="mt-2 block rounded-xl px-4 py-4 text-sm font-semibold leading-7"
          style={{ background: isDark ? 'rgba(245, 158, 11, 0.16)' : '#fff7ed', color: '#b45309' }}
        >
          {current.next.text} →
        </Link>
      )}
      </>
      )}
    </article>
  );
}
