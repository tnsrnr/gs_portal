'use client';

import { useEffect, useRef, useState } from 'react';
import type { StudyCard } from './project-cards';
import { buildSegments, partLabel, readModes, speechSupported, type ReadMode, type SpeechPart } from './speech-text';

export type SpeechStatus = 'idle' | 'playing' | 'paused';

export type SpeechActive = {
  index: number;
  part: SpeechPart;
  chunkIndex: number;
  tag?: string;
};

function pickKorean(voices: SpeechSynthesisVoice[]) {
  return voices.find((voice) => voice.lang === 'ko-KR' && voice.localService) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('ko')) ?? null;
}

export function useKeywordSpeech(cards: StudyCard[]) {
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  const rateRef = useRef(1);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const repeatRef = useRef(false);
  const autoNextRef = useRef(false);
  const modeRef = useRef<ReadMode>('all');
  const queueRef = useRef<ReturnType<typeof buildSegments>>([]);
  const cardIndexRef = useRef(0);
  const cursorRef = useRef(0);
  const continueRef = useRef<() => void>(() => {});
  const liveRef = useRef(false);
  const pausedRef = useRef(false);
  const tokenRef = useRef(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [ready, setReady] = useState(false);
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<SpeechStatus>('idle');
  const [active, setActive] = useState<SpeechActive | null>(null);
  const [mode, setModeState] = useState<ReadMode>('all');
  const [rate, setRateState] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState('');
  const [koreanMissing, setKoreanMissing] = useState(false);
  const [cover, setCover] = useState(false);
  const [autoNext, setAutoNextState] = useState(false);
  const [repeat, setRepeatState] = useState(false);

  const stop = () => {
    tokenRef.current += 1;
    pausedRef.current = false;
    liveRef.current = false;
    queueRef.current = [];
    utterRef.current = null;
    window.speechSynthesis?.cancel();
    setStatus('idle');
    setActive(null);
  };

  const playRef = useRef<(index: number, nextMode?: ReadMode) => void>(() => {});

  playRef.current = (index: number, nextMode?: ReadMode) => {
    if (!speechSupported() || !cardsRef.current[index]) return;
    const chosen = nextMode ?? modeRef.current;
    modeRef.current = chosen;
    setModeState(chosen);
    const segments = buildSegments(cardsRef.current[index], chosen);
    tokenRef.current += 1;
    const token = tokenRef.current;
    pausedRef.current = false;
    cardIndexRef.current = index;
    queueRef.current = segments;
    window.speechSynthesis.cancel();
    if (segments.length === 0) {
      setStatus('idle');
      setActive(null);
      return;
    }
    setStatus('playing');

    const finish = () => {
      if (token !== tokenRef.current) return;
      if (repeatRef.current && !autoNextRef.current) {
        playRef.current(cardIndexRef.current, modeRef.current);
        return;
      }
      if (autoNextRef.current) {
        const next = cardIndexRef.current + 1;
        if (next < cardsRef.current.length) {
          playRef.current(next, modeRef.current);
          return;
        }
        if (repeatRef.current) {
          playRef.current(0, modeRef.current);
          return;
        }
      }
      setStatus('idle');
      setActive(null);
    };

    const speakAt = (cursor: number) => {
      if (token !== tokenRef.current) return;
      cursorRef.current = cursor;
      continueRef.current = () => speakAt(cursorRef.current);
      if (pausedRef.current) return;
      const segment = queueRef.current[cursor];
      if (!segment) {
        finish();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = 'ko-KR';
      utterance.rate = rateRef.current;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterRef.current = utterance;
      liveRef.current = true;
      setActive({ index: cardIndexRef.current, part: segment.part, chunkIndex: segment.chunkIndex, tag: segment.tag });
      let moved = false;
      const advance = () => {
        if (moved || token !== tokenRef.current) return;
        moved = true;
        liveRef.current = false;
        speakAt(cursor + 1);
      };
      utterance.onend = advance;
      utterance.onerror = (event) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          liveRef.current = false;
          return;
        }
        advance();
      };
      window.speechSynthesis.speak(utterance);
    };

    window.setTimeout(() => speakAt(0), 50);
  };

  useEffect(() => {
    setReady(true);
    setSupported(speechSupported());
  }, []);

  useEffect(() => {
    return () => {
      tokenRef.current += 1;
      pausedRef.current = false;
      liveRef.current = false;
      window.speechSynthesis?.cancel();
      setStatus('idle');
      setActive(null);
    };
  }, [cards]);

  useEffect(() => {
    if (!ready || !supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const korean = all.filter((voice) => voice.lang.toLowerCase().startsWith('ko'));
      setVoices(korean);
      setKoreanMissing(all.length > 0 && korean.length === 0);
      const current = voiceRef.current && korean.some((voice) => voice.voiceURI === voiceRef.current?.voiceURI) ? voiceRef.current : pickKorean(korean);
      voiceRef.current = current;
      setVoiceURI(current?.voiceURI ?? '');
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [ready, supported]);

  useEffect(() => {
    if (!ready || !supported) return;
    const halt = () => {
      tokenRef.current += 1;
      window.speechSynthesis.cancel();
    };
    window.addEventListener('pagehide', halt);
    return () => {
      window.removeEventListener('pagehide', halt);
      halt();
    };
  }, [ready, supported]);

  useEffect(() => {
    if (status === 'idle' || active == null) return;
    document.getElementById(`study3-card-${active.index}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [active?.index, status]);

  const play = (index: number, nextMode?: ReadMode) => playRef.current(index, nextMode);
  const pause = () => {
    if (status !== 'playing') return;
    pausedRef.current = true;
    window.speechSynthesis.pause();
    setStatus('paused');
  };
  const resume = () => {
    if (status !== 'paused') return;
    pausedRef.current = false;
    setStatus('playing');
    if (liveRef.current) {
      window.speechSynthesis.resume();
      return;
    }
    window.speechSynthesis.cancel();
    continueRef.current();
  };
  const setMode = (next: ReadMode) => {
    modeRef.current = next;
    setModeState(next);
  };
  const setRate = (next: number) => {
    const clamped = Math.min(1.3, Math.max(0.7, Math.round(next * 10) / 10));
    rateRef.current = clamped;
    setRateState(clamped);
  };
  const setVoice = (uri: string) => {
    const voice = voices.find((item) => item.voiceURI === uri) ?? null;
    voiceRef.current = voice;
    setVoiceURI(uri);
  };
  const setAutoNext = (next: boolean) => {
    autoNextRef.current = next;
    setAutoNextState(next);
  };
  const setRepeat = (next: boolean) => {
    repeatRef.current = next;
    setRepeatState(next);
  };

  const position = active ? `${active.index + 1}/${cards.length} · ${partLabel[active.part]}` : `0/${cards.length}`;

  return {
    ready,
    supported,
    status,
    active,
    mode,
    setMode,
    rate,
    setRate,
    voices,
    voiceURI,
    setVoice,
    koreanMissing,
    cover,
    setCover,
    autoNext,
    setAutoNext,
    repeat,
    setRepeat,
    position,
    play,
    pause,
    resume,
    stop,
    playCurrent: () => play(active?.index ?? cardIndexRef.current, modeRef.current),
  };
}

export function KeywordSpeechBar({ speech }: { speech: ReturnType<typeof useKeywordSpeech> }) {
  if (!speech.ready) return null;

  const buttonStyle = {
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
    background: 'var(--bg-tertiary)',
  };

  return (
    <div
      className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-[12px]"
      style={{
        background: 'var(--bg-card)',
        borderColor: speech.status === 'playing' ? '#0891b2' : 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      {!speech.supported ? (
        <p style={{ color: 'var(--text-secondary)' }}>이 브라우저는 음성 읽기를 지원하지 않습니다. Chrome에서 사용할 수 있습니다.</p>
      ) : (
        <>
          <span className="inline-flex items-center gap-1 font-medium" style={{ color: speech.status === 'playing' ? '#0891b2' : 'var(--text-secondary)' }}>
            <span className={`h-1.5 w-1.5 rounded-full ${speech.status === 'playing' ? 'animate-pulse bg-cyan-600' : 'bg-slate-300'}`} />
            {speech.status === 'playing' ? '재생 중' : speech.status === 'paused' ? '일시정지' : '대기'}
            <span>{speech.position}</span>
          </span>
          <button type="button" className="rounded-full border px-2.5 py-1" style={buttonStyle} onClick={speech.playCurrent}>
            재생
          </button>
          <button type="button" className="rounded-full border px-2.5 py-1 disabled:opacity-40" style={buttonStyle} onClick={speech.pause} disabled={speech.status !== 'playing'}>
            일시정지
          </button>
          <button type="button" className="rounded-full border px-2.5 py-1 disabled:opacity-40" style={buttonStyle} onClick={speech.resume} disabled={speech.status !== 'paused'}>
            재개
          </button>
          <button type="button" className="rounded-full border px-2.5 py-1 disabled:opacity-40" style={buttonStyle} onClick={speech.stop} disabled={speech.status === 'idle'}>
            정지
          </button>
          <label className="inline-flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            속도
            <input
              type="range"
              min={0.7}
              max={1.3}
              step={0.1}
              value={speech.rate}
              aria-label="읽기 속도"
              className="w-24"
              onChange={(event) => speech.setRate(Number(event.target.value))}
            />
            <span className="w-8">{speech.rate.toFixed(1)}배</span>
          </label>
          {speech.voices.length > 0 && (
            <label className="inline-flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              음성
              <select
                aria-label="한국어 음성"
                className="max-w-[9rem] rounded-md border px-1 py-1"
                style={buttonStyle}
                value={speech.voiceURI}
                onChange={(event) => speech.setVoice(event.target.value)}
              >
                {speech.voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            aria-pressed={speech.cover}
            className="rounded-full border px-2.5 py-1"
            style={{ ...buttonStyle, background: speech.cover ? '#0891b2' : buttonStyle.background, color: speech.cover ? '#ffffff' : buttonStyle.color }}
            onClick={() => speech.setCover(!speech.cover)}
          >
            화면 가리기
          </button>
          <button
            type="button"
            aria-pressed={speech.autoNext}
            className="rounded-full border px-2.5 py-1"
            style={{ ...buttonStyle, background: speech.autoNext ? '#0891b2' : buttonStyle.background, color: speech.autoNext ? '#ffffff' : buttonStyle.color }}
            onClick={() => speech.setAutoNext(!speech.autoNext)}
          >
            다음 토픽
          </button>
          <button
            type="button"
            aria-pressed={speech.repeat}
            className="rounded-full border px-2.5 py-1"
            style={{ ...buttonStyle, background: speech.repeat ? '#0891b2' : buttonStyle.background, color: speech.repeat ? '#ffffff' : buttonStyle.color }}
            onClick={() => speech.setRepeat(!speech.repeat)}
          >
            반복
          </button>
          <label className="inline-flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            범위
            <select
              aria-label="읽기 범위"
              className="rounded-md border px-1 py-1"
              style={buttonStyle}
              value={speech.mode}
              onChange={(event) => speech.setMode(event.target.value as ReadMode)}
            >
              {readModes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {speech.koreanMissing && <span style={{ color: 'var(--text-secondary)' }}>한국어 음성이 없어 기본 음성으로 읽습니다.</span>}
        </>
      )}
    </div>
  );
}
