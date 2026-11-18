'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import { getTocItem } from '../toc';
import { strategyDocument, type StudyBlock, type StudyDocument } from '../strategy-content';
import { strategySummary } from '../strategy-summary-content';
import { projectDocument } from '../project-content';
import { projectSummary } from '../project-summary-content';
import { softwareDocument } from '../software-content';
import { softwareSummary } from '../software-summary-content';
import { serviceDocument } from '../service-content';
import { serviceSummary } from '../service-summary-content';
import { networkDocument } from '../network-content';
import { networkSummary } from '../network-summary-content';
import { securityDocument } from '../security-content';
import { securitySummary } from '../security-summary-content';
import { analysisDocument } from '../analysis-content';
import { analysisSummary } from '../analysis-summary-content';
import { aiDocument } from '../ai-content';
import { aiSummary } from '../ai-summary-content';
import { caDocument } from '../ca-content';
import { caSummary } from '../ca-summary-content';
import { algorithmDocument } from '../algorithm-content';
import { algorithmSummary } from '../algorithm-summary-content';
import { osDocument } from '../os-content';
import { osSummary } from '../os-summary-content';
import { dsDocument } from '../ds-content';
import { dsSummary } from '../ds-summary-content';
import { storyDocument } from '../story-content';
import { storyTermsDocument } from '../story-terms-content';
import { roadmaps, type Roadmap } from '../roadmaps';
import { termRoadmaps } from '../term-roadmaps';
import { RoadmapView } from '../roadmap-view';
import { FontStepControl, studyFontZoom, useStudyFont } from '../font-step';
import { TopicPopup, useTopicIndex, type TopicBrief } from '../topic-lookup';
import { useTheme } from '@/common/hooks/useTheme';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function keywordPattern(keyword: string) {
  const startsWithHangul = /^[가-힣]/.test(keyword);
  const endsWithHangul = /[가-힣]$/.test(keyword);
  const before = startsWithHangul ? '(?<![가-힣])' : '(?<![A-Za-z0-9])';
  // 영문 약어는 MECE입니다, SOM은처럼 조사가 바로 붙어도 칠한다.
  // 한글 용어는 플랫폼은처럼 조사만 허용하고, 더 긴 단어의 일부는 칠하지 않는다.
  const after = endsWithHangul
    ? '(?=(?:입니다|이다|이란|이며|이고|에서|에게|으로|은|는|이|가|을|를|와|과|도|만|의|에|로)?(?![가-힣]))'
    : '(?![A-Za-z0-9])';
  return `${before}${escapeRegExp(keyword)}${after}`;
}

function KeywordText({
  text,
  keywords,
  active,
  isDark,
  topicIndex,
  onTopic,
}: {
  text: string;
  keywords: string[];
  active: string | null;
  isDark: boolean;
  topicIndex: Map<string, TopicBrief[]>;
  onTopic: (keyword: string, items: TopicBrief[]) => void;
}) {
  const nodes = useMemo(() => {
    const source = active ? keywords.filter((keyword) => keyword === active) : keywords;
    if (source.length === 0) return [text];
    const pattern = source
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(keywordPattern)
      .join('|');
    const matcher = new RegExp(pattern, 'g');
    const parts: Array<string | { keyword: string }> = [];
    let cursor = 0;
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(text))) {
      const index = match.index ?? 0;
      if (index > cursor) parts.push(text.slice(cursor, index));
      parts.push({ keyword: match[0] });
      cursor = index + match[0].length;
    }
    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  }, [text, keywords, active]);

  return (
    <>
      {nodes.map((part, index) =>
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          (() => {
            const hits = topicIndex.get(part.keyword.toLowerCase());
            return (
              <mark
                key={index}
                data-keyword={part.keyword}
                role={hits ? 'button' : undefined}
                tabIndex={hits ? 0 : undefined}
                title={hits ? '약어 정의' : undefined}
                onClick={hits ? () => onTopic(part.keyword, hits) : undefined}
                onKeyDown={
                  hits
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onTopic(part.keyword, hits);
                        }
                      }
                    : undefined
                }
                style={{
                  background: isDark ? 'rgba(251, 191, 36, 0.28)' : '#fde68a',
                  color: isDark ? '#fff7d6' : '#92400e',
                  fontWeight: 800,
                  borderRadius: 6,
                  padding: '0 4px',
                  boxShadow: isDark ? 'inset 0 -2px 0 #fbbf24' : 'inset 0 -2px 0 #d97706',
                  cursor: hits ? 'pointer' : undefined,
                }}
              >
                {part.keyword}
              </mark>
            );
          })()
        )
      )}
    </>
  );
}

function chapterKeywords(blocks: StudyBlock[], keywords: string[]) {
  const text = blocks.map((block) => block.text).join('\n');
  return keywords.filter((keyword) => text.includes(keyword));
}

export default function Study2DetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const { size: fontSize, setSize: setFontSize } = useStudyFont();
  const fontZoom = studyFontZoom(fontSize);
  const topicIndex = useTopicIndex();
  const [topicPopup, setTopicPopup] = useState<{ keyword: string; items: TopicBrief[] } | null>(null);
  const item = getTocItem(params.slug);
  const [mode, setMode] = useState<'read' | 'pdf'>('read');
  const [edition, setEdition] = useState<'easy' | 'summary' | 'roadmap' | 'terms'>('easy');
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const documents: Record<string, { easy: StudyDocument; summary?: StudyDocument; roadmap?: Roadmap; termRoadmap?: Roadmap; terms?: StudyDocument }> = {
    strategy: { easy: strategyDocument, summary: strategySummary, roadmap: roadmaps.strategy, termRoadmap: termRoadmaps.strategy },
    project: { easy: projectDocument, summary: projectSummary, roadmap: roadmaps.project, termRoadmap: termRoadmaps.project },
    software: { easy: softwareDocument, summary: softwareSummary, roadmap: roadmaps.software, termRoadmap: termRoadmaps.software },
    'digital-service': { easy: serviceDocument, summary: serviceSummary, roadmap: roadmaps['digital-service'], termRoadmap: termRoadmaps['digital-service'] },
    'digital-network': { easy: networkDocument, summary: networkSummary, roadmap: roadmaps['digital-network'], termRoadmap: termRoadmaps['digital-network'] },
    'digital-security': { easy: securityDocument, summary: securitySummary, roadmap: roadmaps['digital-security'], termRoadmap: termRoadmaps['digital-security'] },
    'data-analysis': { easy: analysisDocument, summary: analysisSummary, roadmap: roadmaps['data-analysis'], termRoadmap: termRoadmaps['data-analysis'] },
    ai: { easy: aiDocument, summary: aiSummary, roadmap: roadmaps.ai, termRoadmap: termRoadmaps.ai },
    'ca-system': { easy: caDocument, summary: caSummary, roadmap: roadmaps['ca-system'], termRoadmap: termRoadmaps['ca-system'] },
    algorithm: { easy: algorithmDocument, summary: algorithmSummary, roadmap: roadmaps.algorithm, termRoadmap: termRoadmaps.algorithm },
    os: { easy: osDocument, summary: osSummary, roadmap: roadmaps.os, termRoadmap: termRoadmaps.os },
    'data-structure': { easy: dsDocument, summary: dsSummary, roadmap: roadmaps['data-structure'], termRoadmap: termRoadmaps['data-structure'] },
    story: { easy: storyDocument, terms: storyTermsDocument },
  };
  const pack = item ? documents[item.slug] : undefined;
  const showingRoadmap = edition === 'roadmap' && !!pack?.roadmap;
  const doc = !pack
    ? null
    : edition === 'summary' && pack.summary
      ? pack.summary
      : edition === 'terms' && pack.terms
        ? pack.terms
        : pack.easy;

  useEffect(() => {
    setActiveKeyword(null);
    setMode('read');
    setEdition((current) => {
      const next = documents[params.slug];
      if (!next) return 'easy';
      if (current === 'summary' && !next.summary) return 'easy';
      if (current === 'roadmap' && !next.roadmap) return 'easy';
      if (current === 'terms' && !next.terms) return 'easy';
      return current;
    });
    pageRef.current?.scrollTo({ top: 0 });
  }, [params.slug]);

  const selectEdition = (next: 'easy' | 'summary' | 'roadmap' | 'terms') => {
    setEdition(next);
    setActiveKeyword(null);
    if (next === 'roadmap') setMode('read');
    pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const focusKeyword = (keyword: string) => {
    const next = activeKeyword === keyword ? null : keyword;
    setActiveKeyword(next);
    requestAnimationFrame(() => {
      const root = articleRef.current;
      if (!root) return;
      const mark = root.querySelector(`mark[data-keyword="${CSS.escape(keyword)}"]`);
      mark?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <div ref={pageRef} className="h-full overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/study2')}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            목차
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {item?.label ?? '목차'}
            </h1>
          </div>
          <FontStepControl size={fontSize} onChange={setFontSize} />
          {doc && (pack?.summary || pack?.roadmap) && (
            <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => selectEdition('easy')}
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  background: edition === 'easy' ? '#b45309' : 'transparent',
                  color: edition === 'easy' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                쉽게 이해하기
              </button>
              {pack?.summary && (
                <button
                  type="button"
                  onClick={() => selectEdition('summary')}
                  className="rounded-full px-3 py-1.5 text-sm font-medium"
                  style={{
                    background: edition === 'summary' ? '#b45309' : 'transparent',
                    color: edition === 'summary' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  개념 요약
                </button>
              )}
              {pack?.roadmap && (
                <button
                  type="button"
                  onClick={() => selectEdition('roadmap')}
                  className="rounded-full px-3 py-1.5 text-sm font-medium"
                  style={{
                    background: edition === 'roadmap' ? '#b45309' : 'transparent',
                    color: edition === 'roadmap' ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  로드맵
                </button>
              )}
            </div>
          )}
          {doc && pack?.terms && !pack.summary && (
            <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => selectEdition('easy')}
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  background: edition === 'easy' ? '#b45309' : 'transparent',
                  color: edition === 'easy' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                말로 풀기
              </button>
              <button
                type="button"
                onClick={() => selectEdition('terms')}
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  background: edition === 'terms' ? '#b45309' : 'transparent',
                  color: edition === 'terms' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                실제 용어
              </button>
            </div>
          )}
          {doc && doc.pdf && !showingRoadmap && (
            <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setMode('read')}
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  background: mode === 'read' ? '#f59e0b' : 'transparent',
                  color: mode === 'read' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                키워드 학습
              </button>
              <button
                type="button"
                onClick={() => setMode('pdf')}
                className="rounded-full px-3 py-1.5 text-sm font-medium"
                style={{
                  background: mode === 'pdf' ? '#f59e0b' : 'transparent',
                  color: mode === 'pdf' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                원본 PDF
              </button>
            </div>
          )}
        </div>

        {!item && (
          <div className="rounded-2xl border p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>없는 목차입니다.</p>
          </div>
        )}

        {item && !doc && (
          <div
            className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border p-10 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <FolderOpen className="mb-4 h-12 w-12 text-amber-500" />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {item.label}
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              이 목차의 자료는 아직 준비 중입니다.
            </p>
          </div>
        )}

        {showingRoadmap && pack?.roadmap && (
          <div style={{ zoom: fontZoom }}>
            <RoadmapView roadmap={pack.roadmap} terms={pack.termRoadmap} isDark={isDark} />
          </div>
        )}

        {doc && !showingRoadmap && mode === 'pdf' && (
          <iframe
            title={`${doc.title} ${doc.edition}`}
            src={doc.pdf}
            className="w-full rounded-2xl border"
            style={{ height: 'calc(100vh - 150px)', borderColor: 'var(--border-color)', background: '#fff' }}
          />
        )}

        {doc && !showingRoadmap && mode === 'read' && (
          <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]" style={{ zoom: fontZoom }}>
            <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
              <div className="rounded-2xl border p-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                {doc.chapters.map((chapter) => (
                  <a
                    key={chapter.id}
                    href={`#${chapter.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm hover:bg-black/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {chapter.title}
                  </a>
                ))}
              </div>
            </aside>

            <article
              ref={articleRef}
              className="rounded-2xl border px-5 py-6 sm:px-8"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <p className="text-sm font-semibold text-amber-600">{doc.subtitle}</p>
              <h2 className="mt-1 text-3xl font-bold">{doc.title}</h2>
              <p className="mt-3 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
                {doc.lead}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {doc.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: isDark ? 'rgba(251, 191, 36, 0.16)' : '#fff7ed', color: '#b45309' }}
                  >
                    {theme}
                  </span>
                ))}
              </div>
              <p className="mt-5 rounded-xl px-4 py-3 text-sm leading-7" style={{ background: 'var(--bg-tertiary)' }}>
                {doc.howTo}
                {doc.keywords.length > 0 && ' 노란 표시가 이 자료의 키워드입니다. 키워드를 누르면 그 단어만 강조됩니다.'}
              </p>

              {doc.chapters.map((chapter) => {
                const chips = chapterKeywords(chapter.blocks, doc.keywords);
                return (
                  <section key={chapter.id} id={chapter.id} className="mt-10 scroll-mt-6">
                    <h3 className="text-xl font-bold">{chapter.title}</h3>
                    {chips.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {chips.map((keyword) => {
                          const selected = activeKeyword === keyword;
                          return (
                            <button
                              key={keyword}
                              type="button"
                              onClick={() => focusKeyword(keyword)}
                              className="rounded-full px-2.5 py-1 text-xs font-bold"
                              style={{
                                background: selected ? '#d97706' : isDark ? 'rgba(251, 191, 36, 0.18)' : '#fef3c7',
                                color: selected ? '#fff' : '#92400e',
                              }}
                            >
                              {keyword}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-4 space-y-3 text-[15px] leading-8">
                      {chapter.blocks.map((block, index) => {
                        if (block.type === 'h3') {
                          return (
                            <h4 key={index} className="pt-3 text-base font-bold text-amber-700">
                              {block.text}
                            </h4>
                          );
                        }
                        if (block.type === 'link') {
                          return (
                            <p
                              key={index}
                              className="rounded-xl px-4 py-3 text-sm leading-7"
                              style={{ background: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb' }}
                            >
                              <KeywordText text={block.text} keywords={doc.keywords} active={activeKeyword} isDark={isDark} topicIndex={topicIndex} onTopic={(keyword, items) => setTopicPopup({ keyword, items })} />
                            </p>
                          );
                        }
                        if (block.type === 'li') {
                          return (
                            <p key={index} className="pl-1">
                              <span className="mr-2 font-bold text-amber-500">·</span>
                              <KeywordText text={block.text} keywords={doc.keywords} active={activeKeyword} isDark={isDark} topicIndex={topicIndex} onTopic={(keyword, items) => setTopicPopup({ keyword, items })} />
                            </p>
                          );
                        }
                        return (
                          <p key={index}>
                            <KeywordText text={block.text} keywords={doc.keywords} active={activeKeyword} isDark={isDark} topicIndex={topicIndex} onTopic={(keyword, items) => setTopicPopup({ keyword, items })} />
                          </p>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              <p className="mt-10 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                정리 기준일 {doc.updated} · {doc.part} · {doc.edition}
              </p>
            </article>
          </div>
        )}
      </div>
      {topicPopup && (
        <TopicPopup
          keyword={topicPopup.keyword}
          items={topicPopup.items}
          onClose={() => setTopicPopup(null)}
        />
      )}
    </div>
  );
}
