import type { StudyCard } from './project-cards';
import { study3Cards } from './cards';
import { chapterRoadmaps } from './chapter-roadmaps';
import { findStudyCard } from './related-lookup';

export type RelatedLevel = 'up' | 'down';

function splitTopic(topic: string) {
  if (!topic.endsWith(')')) return { head: topic, tail: '' };
  const open = topic.lastIndexOf('(');
  if (open <= 0) return { head: topic, tail: '' };
  return { head: topic.slice(0, open).trim(), tail: topic.slice(open + 1, -1).trim() };
}

function norm(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

function headOf(card: StudyCard) {
  return splitTopic(card.topic).head;
}

function headKey(card: StudyCard) {
  return norm(headOf(card));
}

function tokens(value: string) {
  return value
    .toLowerCase()
    .split(/[^0-9a-z가-힣]+/)
    .filter(Boolean);
}

function variantMarks(value: string) {
  return (value.match(/[+*]|Ⅱ|\bII\b|\d/g) ?? []).length;
}

function allCards() {
  return Object.values(study3Cards).flat();
}

function cardForName(name: string) {
  const stripped = name.replace(/\([^)]*\)/g, '').trim();
  const exact = allCards().find((card) => headKey(card) === norm(stripped) || norm(card.topic) === norm(name));
  if (exact) return exact;
  if (norm(stripped).length < 4) return null;
  const hits = allCards().filter((card) => {
    const head = headKey(card);
    return head.startsWith(norm(stripped)) || norm(stripped).startsWith(head);
  });
  hits.sort((a, b) => headKey(a).length - headKey(b).length);
  return hits[0] ?? null;
}

const peerBoxes = new Map<string, Set<number>>();

let boxId = 0;
for (const roadmap of Object.values(chapterRoadmaps)) {
  for (const sheet of roadmap.sheets) {
    const lists = [
      ...(sheet.stages ?? []).map((stage) => stage.items),
      ...(sheet.groups ?? []).map((group) => group.items),
      ...(sheet.bar ? [sheet.bar] : []),
    ];
    for (const items of lists) {
      const id = boxId++;
      for (const name of items) {
        const card = cardForName(name);
        if (!card) continue;
        const key = headKey(card);
        const set = peerBoxes.get(key) ?? new Set<number>();
        set.add(id);
        peerBoxes.set(key, set);
      }
    }
  }
}

function sameLevel(a: StudyCard, b: StudyCard) {
  const left = peerBoxes.get(headKey(a));
  const right = peerBoxes.get(headKey(b));
  if (!left || !right) return false;
  for (const id of left) if (right.has(id)) return true;
  return false;
}

const breadth = new Map<string, number>();

for (const cards of Object.values(study3Cards)) {
  for (const card of cards) {
    const seen = new Set<string>();
    for (const tag of card.related.split(',')) {
      const hit = findStudyCard(tag.trim(), '');
      if (!hit) continue;
      const key = headKey(hit.card);
      if (!key || key === headKey(card) || seen.has(key)) continue;
      seen.add(key);
      breadth.set(key, (breadth.get(key) ?? 0) + 1);
    }
  }
}

function narrower(longer: string, shorter: string) {
  if (norm(longer) === norm(shorter)) return false;
  const longTokens = tokens(longer);
  const shortTokens = tokens(shorter);
  if (!shortTokens.length || !longTokens.length) return false;
  const sameTokens = shortTokens.length === longTokens.length && shortTokens.every((token, index) => longTokens[index] === token);
  if (sameTokens) return variantMarks(longer) > 0 && variantMarks(shorter) === 0;
  const prefixed = shortTokens.length < longTokens.length && shortTokens.every((token, index) => longTokens[index] === token);
  const contains = shortTokens.length === 1 && shortTokens[0].length >= 2 && longTokens.includes(shortTokens[0]);
  if (!prefixed && !contains) return false;
  const longMarks = variantMarks(longer);
  const shortMarks = variantMarks(shorter);
  if (longMarks > 0 && shortMarks > 0) return false;
  return true;
}

function cites(card: StudyCard, other: StudyCard) {
  return card.related.split(',').some((tag) => {
    const hit = findStudyCard(tag.trim(), '');
    return !!hit && headKey(hit.card) === headKey(other);
  });
}

export function relatedLevel(card: StudyCard, tag: string, slug: string): RelatedLevel | null {
  const hit = findStudyCard(tag, slug);
  if (!hit || headKey(hit.card) === headKey(card)) return null;
  const other = hit.card;
  const currentHead = headOf(card);
  const otherHead = headOf(other);
  if (narrower(otherHead, currentHead)) return 'down';
  if (narrower(currentHead, otherHead)) return 'up';
  if (sameLevel(card, other) || hit.slug !== slug) return null;
  if (!cites(other, card)) return null;
  const gap = (breadth.get(headKey(other)) ?? 0) - (breadth.get(headKey(card)) ?? 0);
  if (gap >= 2) return 'up';
  if (gap <= -2) return 'down';
  return null;
}
