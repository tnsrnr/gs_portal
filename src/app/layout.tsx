import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/global/styles/globals.css';
import '@/common/styles/themes.css';
import { Header } from '@/components/layout/Header';
import { ThemeProvider } from '@/common/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '학습 자료 관리',
  description: '학습 자료 입력 및 조회 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
} 