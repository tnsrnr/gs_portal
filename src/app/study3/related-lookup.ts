import type { StudyCard } from './project-cards';
import { study3Cards } from './cards';

function splitTopic(topic: string) {
  if (!topic.endsWith(')')) return { head: topic, tail: '' };
  const open = topic.lastIndexOf('(');
  if (open <= 0) return { head: topic, tail: '' };
  return {
    head: topic.slice(0, open).trim(),
    tail: topic.slice(open + 1, -1).trim(),
  };
}

function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

function acronyms(value: string) {
  return value.split(/[\s,/+:·()]+/).filter((token) => {
    const raw = token.replace(/[^A-Za-z0-9]/g, '');
    return raw.length >= 2 && raw.length <= 16 && (raw === raw.toUpperCase() || /\d/.test(raw));
  });
}

function aliases(topic: string) {
  const { head, tail } = splitTopic(topic);
  const names = [head];
  const headCore = head.replace(/\([^)]*\)$/, '').trim();
  if (headCore && headCore !== head) names.push(headCore);
  if (tail) {
    names.push(tail);
    for (const part of tail.split(/[:：]/)) {
      const text = part.trim();
      if (text) names.push(text);
    }
  }
  return [...names, ...acronyms(head), ...acronyms(tail)];
}

export type RelatedHit = { card: StudyCard; slug: string };

const relatedIndex = new Map<string, RelatedHit[]>();

for (const [slug, cards] of Object.entries(study3Cards)) {
  for (const card of cards) {
    const seen = new Set<string>();
    for (const alias of aliases(card.topic)) {
      const key = norm(alias);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const list = relatedIndex.get(key) ?? [];
      list.push({ card, slug });
      relatedIndex.set(key, list);
    }
  }
}

export function findStudyCard(tag: string, currentSlug: string): RelatedHit | null {
  const hits = relatedIndex.get(norm(tag));
  if (!hits?.length) return null;
  const key = norm(tag);
  const exactHead = (hit: RelatedHit) => norm(splitTopic(hit.card.topic).head) === key;
  return (
    hits.find((hit) => hit.slug === currentSlug && exactHead(hit)) ??
    hits.find(exactHead) ??
    hits.find((hit) => hit.slug === currentSlug) ??
    hits[0]
  );
}
