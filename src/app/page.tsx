'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit3, Eye, BookOpen, GraduationCap, ArrowRight, type LucideIcon } from 'lucide-react';

interface HomeCard {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  glow: string;
  wash: string;
}

const cards: HomeCard[] = [
  {
    title: '입력',
    subtitle: '토픽 자료 입력',
    description: '토픽 정보를 입력하고 관리할 수 있습니다.',
    href: '/input',
    icon: Edit3,
    accent: 'var(--accent-blue)',
    glow: 'rgba(59, 130, 246, 0.8)',
    wash: 'rgba(59, 130, 246, 0.15)',
  },
  {
    title: '조회',
    subtitle: '토픽 자료 조회',
    description: '저장된 토픽 정보를 조회하고 확인할 수 있습니다.',
    href: '/view',
    icon: Eye,
    accent: 'var(--accent-green)',
    glow: 'rgba(34, 197, 94, 0.8)',
    wash: 'rgba(34, 197, 94, 0.15)',
  },
  {
    title: '학습',
    subtitle: '토픽 학습',
    description: '저장된 토픽을 학습하고 암기할 수 있습니다.',
    href: '/study',
    icon: BookOpen,
    accent: 'rgba(147, 51, 234, 1)',
    glow: 'rgba(168, 85, 247, 0.8)',
    wash: 'rgba(147, 51, 234, 0.15)',
  },
  {
    title: '학습 2',
    subtitle: '목차 학습',
    description: '목차를 고르고, 키워드가 드러나는 자료로 학습합니다.',
    href: '/study2',
    icon: GraduationCap,
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.85)',
    wash: 'rgba(245, 158, 11, 0.16)',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [cardRotations, setCardRotations] = useState(() => cards.map(() => ({ x: 0, y: 0 })));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    const rotateX = (mouseY / rect.height) * -30;
    const rotateY = (mouseX / rect.width) * 30;

    setCardRotations((prev) => {
      const next = [...prev];
      next[cardIndex] = { x: rotateX, y: rotateY };
      return next;
    });
  };

  const handleMouseLeave = (cardIndex: number) => {
    setCardRotations((prev) => {
      const next = [...prev];
      next[cardIndex] = { x: 0, y: 0 };
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 51, 234, 0.08) 50%, rgba(34, 197, 94, 0.12) 100%)'
        }}></div>
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.25) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(147, 51, 234, 0.4) 2px, transparent 2px), radial-gradient(circle at 75px 75px, rgba(34, 197, 94, 0.4) 2px, transparent 2px)',
          backgroundSize: '100px 100px, 150px 150px',
          backgroundPosition: '0 0, 50px 50px'
        }}></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.3) 0%, transparent 4%), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.25) 0%, transparent 4%), radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.2) 0%, transparent 3%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.2) 0%, transparent 3%)',
          backgroundSize: '350px 350px, 450px 450px, 250px 250px, 300px 300px',
          backgroundPosition: '0% 0%, 100% 100%, 50% 0%, 0% 100%'
        }}></div>
      </div>

      <div className="relative z-10 flex min-h-full items-center justify-center py-24">
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const rotation = cardRotations[index] ?? { x: 0, y: 0 };
              return (
                <div
                  key={card.href}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(card.href);
                    }
                  }}
                  className="profile-card backdrop-blur-2xl rounded-3xl p-5 border transition-all duration-500 cursor-pointer group flex flex-col justify-center relative overflow-hidden min-h-[320px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.04, 1.04, 1.04)`,
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  onClick={() => router.push(card.href)}
                >
                  <div className="absolute inset-0 opacity-40" style={{
                    background: `linear-gradient(135deg, ${card.wash} 0%, transparent 50%, ${card.wash} 100%), radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)`
                  }}></div>
                  <div className="text-center relative z-10" style={{
                    transform: `translateZ(50px) rotateX(${rotation.x * 0.1}deg) rotateY(${rotation.y * 0.1}deg)`,
                    transformStyle: 'preserve-3d'
                  }}>
                    <div className="w-14 h-14 mx-auto mb-3 rounded-3xl flex items-center justify-center relative" style={{
                      background: `linear-gradient(135deg, ${card.accent} 0%, ${card.glow} 100%)`,
                      boxShadow: `0 8px 32px ${card.wash}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                      transform: `translateZ(30px) rotateX(${rotation.x * 0.2}deg) rotateY(${rotation.y * 0.2}deg)`,
                      transformStyle: 'preserve-3d'
                    }}>
                      <div className="absolute inset-0 rounded-3xl" style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}></div>
                      <Icon className="w-7 h-7 relative z-10 text-white drop-shadow-lg" style={{ transform: 'translateZ(20px)' }} />
                    </div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{card.subtitle}</p>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-tertiary)' }}>{card.description}</p>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium" style={{ color: card.accent }}>
                      <span>자세히 보기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
