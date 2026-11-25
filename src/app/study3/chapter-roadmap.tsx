import type { RoadBox, RoadSheet, Tone } from './chapter-roadmaps';
import { chapterRoadmaps } from './chapter-roadmaps';
import { roadmapMeanings } from './roadmap-meanings';

const toneStyle: Record<Tone, { background: string; borderColor: string; color: string }> = {
  amber: { background: '#fff7ed', borderColor: '#fdba74', color: '#9a3412' },
  blue: { background: '#eff6ff', borderColor: '#93c5fd', color: '#1e40af' },
  green: { background: '#f0fdf4', borderColor: '#86efac', color: '#166534' },
  slate: { background: '#f8fafc', borderColor: '#cbd5e1', color: '#334155' },
  rose: { background: '#fff1f2', borderColor: '#fda4af', color: '#9f1239' },
};

function TopicLine({ name }: { name: string }) {
  const meaning = roadmapMeanings[name];
  return (
    <li className="text-[12px] leading-5 text-slate-800">
      <span className="font-semibold">{name}</span>
      {meaning && <span className="font-normal text-slate-500"> {meaning}</span>}
    </li>
  );
}

function Box({ box }: { box: RoadBox }) {
  const tone = toneStyle[box.tone];
  return (
    <article className="overflow-hidden rounded-lg border bg-white" style={{ borderColor: tone.borderColor }}>
      <h4 className="px-2.5 py-1.5 text-[13px] font-bold leading-5" style={{ background: tone.background, color: tone.color }}>
        {box.title}
      </h4>
      <ul className="space-y-1 px-2.5 py-2">
        {box.items.map((item) => (
          <TopicLine key={item} name={item} />
        ))}
      </ul>
    </article>
  );
}

function Sheet({ sheet }: { sheet: RoadSheet }) {
  const stageCols = 'sm:grid-cols-2 lg:grid-cols-3';
  const groupCols = 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="rounded-lg border px-3 py-3 shadow-sm" style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#1e293b' }}>
      <h3 className="text-[15px] font-bold leading-6">{sheet.title}</h3>
      <p className="mt-1 text-[13px] leading-6 text-slate-600">{sheet.summary}</p>
      {sheet.banner && (
        <p className="mt-3 rounded-md border px-3 py-1.5 text-center text-[13px] font-semibold leading-6" style={{ borderColor: '#cbd5e1', background: '#f8fafc' }}>
          {sheet.banner}
        </p>
      )}
      {sheet.callout && (
        <p className="mt-3 rounded-md px-3 py-2 text-[12px] leading-5" style={{ background: '#ecfeff', color: '#155e75' }}>
          {sheet.callout}
        </p>
      )}
      {sheet.bar && (
        <div className="mt-3">
          {sheet.barLabel && <p className="mb-1 text-[11px] font-semibold text-slate-500">{sheet.barLabel}</p>}
          <div className="flex flex-wrap items-center gap-1.5">
            {sheet.bar.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <span className="rounded-md px-2.5 py-1 text-[12px]" style={{ background: '#fde68a', color: '#78350f' }}>
                  <span className="font-semibold">{item}</span>
                  {roadmapMeanings[item] && <span className="font-normal"> {roadmapMeanings[item]}</span>}
                </span>
                {index < sheet.bar!.length - 1 && <span className="text-slate-400">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}
      {sheet.stages && (
        <div className={`mt-3 grid grid-cols-1 gap-2 ${stageCols}`}>
          {sheet.stages.map((stage) => (
            <article key={stage.step} className="rounded-lg border px-2.5 py-2" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-[12px] font-bold text-cyan-700">
                {stage.step}단계 · {stage.title}
              </p>
              <ul className="mt-1 space-y-1">
                {stage.items.map((item) => (
                  <TopicLine key={item} name={item} />
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
      {sheet.groups && (
        <div className={`mt-3 grid grid-cols-1 gap-2 ${groupCols}`}>
          {sheet.groups.map((box) => (
            <Box key={box.title} box={box} />
          ))}
        </div>
      )}
      {sheet.footer && <p className="mt-3 text-[12px] leading-5 text-slate-500">{sheet.footer}</p>}
    </section>
  );
}

export function ChapterRoadmap({ slug }: { slug: string }) {
  const roadmap = chapterRoadmaps[slug];
  if (!roadmap) return null;

  return (
    <section id="roadmap">
      <p className="text-sm font-semibold text-cyan-700">로드맵</p>
      <h2 className="mt-1 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {roadmap.title}
      </h2>
      <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
        {roadmap.lead}
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {roadmap.sheets.map((sheet) => (
          <Sheet key={sheet.title} sheet={sheet} />
        ))}
      </div>
    </section>
  );
}
