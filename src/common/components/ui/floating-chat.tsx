'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';
import { useTheme } from '@/common/hooks/useTheme';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function FloatingChat() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: '안녕하세요! HTNS 화주 포탈에 오신 것을 환영합니다. 무엇을 도와드릴까요?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatIconRef = useRef<HTMLButtonElement>(null);

  // 드래그 기능
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const rect = dragRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.width / 2;
        const newY = e.clientY - rect.height / 2;
        
        // 화면 경계 내에서만 이동 가능
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 메시지가 추가될 때 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 채팅 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Node;
        const isClickOnChat = chatRef.current?.contains(target);
        const isClickOnIcon = chatIconRef.current?.contains(target);
        
        if (!isClickOnChat && !isClickOnIcon) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage,
        isUser: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // 자동 응답 (시뮬레이션)
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: '감사합니다. 문의사항을 확인했습니다. 담당자가 빠른 시일 내에 연락드리겠습니다.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* 채팅 아이콘 */}
      <motion.div
        ref={dragRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        <motion.button
          ref={chatIconRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseDown={() => setIsDragging(true)}
          className="w-14 h-14 rounded-full shadow-lg border-2 transition-all duration-300 flex items-center justify-center"
          style={{
            background: 'var(--accent-blue)',
            borderColor: 'var(--accent-blue)',
            color: 'white'
          }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* 채팅 창 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-50 w-80 h-96 rounded-2xl border shadow-xl overflow-hidden backdrop-blur-md"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'
            }}
          >
            {/* 헤더 */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ 
                background: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
                borderColor: 'var(--border-secondary)'
              }}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  고객 지원
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded hover:bg-opacity-20 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-opacity-20 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* 메시지 영역 */}
                <div className="flex-1 p-4 overflow-y-auto h-64">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            message.isUser
                              ? 'rounded-br-sm'
                              : 'rounded-bl-sm'
                          }`}
                          style={{
                            background: message.isUser 
                              ? 'var(--accent-blue)' 
                              : 'var(--bg-tertiary)',
                            color: message.isUser 
                              ? 'white' 
                              : 'var(--text-primary)'
                          }}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* 입력 영역 */}
                <div 
                  className="p-4 border-t"
                  style={{ 
                    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(248, 250, 252, 0.95)',
                    borderColor: 'var(--border-secondary)'
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 px-3 py-2 rounded-lg border text-sm"
                      style={{
                        background: theme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        background: 'var(--accent-blue)',
                        color: 'white'
                      }}
                    >
                      전송
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
