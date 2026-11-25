import type { StudyCard } from './project-cards';

export type SpeechPart = 'title' | 'definition' | 'why' | 'related';
export type ReadMode = 'title' | 'upto-definition' | 'upto-why' | 'upto-related' | 'all';

export const readModes: { id: ReadMode; label: string }[] = [
  { id: 'title', label: '제목만' },
  { id: 'upto-definition', label: '정의까지' },
  { id: 'upto-why', label: '필요성까지' },
  { id: 'upto-related', label: '연관까지' },
  { id: 'all', label: '전체' },
];

export const partLabel: Record<SpeechPart, string> = {
  title: '제목',
  definition: '정의',
  why: '필요성',
  related: '연관 단어',
};

const modeParts: Record<ReadMode, SpeechPart[]> = {
  title: ['title'],
  'upto-definition': ['title', 'definition'],
  'upto-why': ['title', 'definition', 'why'],
  'upto-related': ['title', 'definition', 'why', 'related'],
  all: ['title', 'definition', 'why', 'related'],
};

export function splitForSpeech(text: string) {
  const chunks: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const len = i - start + 1;
    const ch = text[i];
    const punct = '.!?。'.includes(ch);
    const soft = len >= 70 && ' ,，、'.includes(ch);
    if ((punct && len >= 8) || soft || len >= 120) {
      chunks.push(text.slice(start, i + 1));
      start = i + 1;
    }
  }
  if (start < text.length) chunks.push(text.slice(start));
  return chunks.filter((chunk) => chunk.trim().length > 0);
}

function topicSpeech(topic: string) {
  if (!topic.endsWith(')')) return topic;
  const open = topic.lastIndexOf('(');
  if (open <= 0) return topic;
  const head = topic.slice(0, open).trim();
  const tail = topic.slice(open + 1, -1).replace(/\s*:\s*/g, ': ').trim();
  return tail ? `${head}. ${tail}` : head;
}

export type SpeechSegment = {
  part: SpeechPart;
  text: string;
  chunkIndex: number;
  tag?: string;
};

export function buildSegments(card: StudyCard, mode: ReadMode): SpeechSegment[] {
  const parts = modeParts[mode];
  const segments: SpeechSegment[] = [];

  if (parts.includes('title')) {
    splitForSpeech(topicSpeech(card.topic)).forEach((text, chunkIndex) => {
      segments.push({ part: 'title', text, chunkIndex });
    });
  }
  if (parts.includes('definition') && card.definition.trim()) {
    splitForSpeech(card.definition.trim()).forEach((text, chunkIndex) => {
      segments.push({ part: 'definition', text: chunkIndex === 0 ? `정의. ${text}` : text, chunkIndex });
    });
  }
  if (parts.includes('why') && card.why.trim()) {
    splitForSpeech(card.why.trim()).forEach((text, chunkIndex) => {
      segments.push({ part: 'why', text: chunkIndex === 0 ? `필요성. ${text}` : text, chunkIndex });
    });
  }
  if (parts.includes('related')) {
    card.related
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((tag, index) => {
        segments.push({
          part: 'related',
          text: index === 0 ? `연관 단어. ${tag}` : tag,
          chunkIndex: index,
          tag,
        });
      });
  }

  return segments;
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}
