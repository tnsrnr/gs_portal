import type { StudyCard } from './project-cards';

function splitTopic(topic: string) {
  if (!topic.endsWith(')')) return { head: topic, tail: '' };
  const open = topic.lastIndexOf('(');
  if (open <= 0) return { head: topic, tail: '' };
  return {
    head: topic.slice(0, open).trim(),
    tail: topic.slice(open + 1, -1).replace(/\s*:\s*/g, ': ').trim(),
  };
}

export function ProjectCardSample({ card }: { card: StudyCard; index: number }) {
  const { head, tail } = splitTopic(card.topic);
  const tags = card.related.split(',').map((item) => item.trim()).filter(Boolean);

  return (
    <article
      className="rounded-lg border px-4 py-3.5 shadow-sm"
      style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#1e293b' }}
    >
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
          {tags.map((tag) => (
            <span key={tag} className="rounded-full px-2 py-0.5 text-[12px] leading-5" style={{ background: '#f1f5f9', color: '#475569' }}>
              {tag}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
