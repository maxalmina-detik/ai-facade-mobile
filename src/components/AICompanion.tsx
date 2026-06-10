import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, X, Send, RefreshCw, HelpCircle, History, Plus, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AICompanionProps {
  onBackToHome?: () => void;
  embedMode?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
}

const SUGGESTED_PROMPTS = [
  'Ringkas masalah lift JPO Lenteng Agung',
  'Apa rencana pemutihan iuran BPJS Kesehatan?',
  'Tim Cook mundur? Siapa suksesor Apple?',
  'Bagaimana penerapan AI kecantikan kulit?'
];

export default function AICompanion({ onBackToHome, embedMode = true }: AICompanionProps) {
  // Load sessions from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('detikai_chat_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat sessions', e);
      }
    }
    return [];
  });

  // Load activeSessionId from localStorage
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('detikai_active_session_id');
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback initial welcome message structure
  const createNewMessagesList = (): ChatMessage[] => [
    {
      id: `msg-welcome-${Date.now()}`,
      sender: 'ai',
      text: 'Halo! Saya detikAI, asisten cerdas digital detikcom. Saya tahu segalanya tentang berita-berita terakurat hari ini! Anda bisa bertanya tentang artikel di portal, rangkuman harian, atau topik apapun. Ada yang bisa saya bantu?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ];

  // Resolve current active session object or provide ephemeral fallback
  const currentSession = sessions.find(s => s.id === activeSessionId) || {
    id: activeSessionId || 'session-ephemeral',
    title: 'Sesi Baru',
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    messages: createNewMessagesList()
  };

  const messages = currentSession.messages;

  // Auto-scroll to latest bubble when state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Synchronize/persist updated messages to active session
  const updateSessionMessages = (newMsgs: ChatMessage[]) => {
    let targetId = activeSessionId;
    
    // If we're on the fallback ephemeral session, create a real session
    if (!targetId || targetId === 'session-ephemeral') {
      targetId = `session-${Date.now()}`;
      setActiveSessionId(targetId);
      localStorage.setItem('detikai_active_session_id', targetId);
    }

    const currentId = targetId;

    setSessions(prev => {
      let existed = false;
      const nextSessions = prev.map(s => {
        if (s.id === currentId) {
          existed = true;
          // Generate an elegant, short title based on first user query if still generic
          let newTitle = s.title;
          if (s.title === 'Sesi Baru' || s.title === 'Diskusi Baru') {
            const firstUserMsg = newMsgs.find(m => m.sender === 'user');
            if (firstUserMsg) {
              newTitle = firstUserMsg.text.length > 25 
                ? firstUserMsg.text.substring(0, 25) + '...' 
                : firstUserMsg.text;
            }
          }
          return {
            ...s,
            messages: newMsgs,
            title: newTitle,
            timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          };
        }
        return s;
      });

      if (!existed) {
        let title = 'Diskusi Baru';
        const firstUserMsg = newMsgs.find(m => m.sender === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.text.length > 25 
            ? firstUserMsg.text.substring(0, 25) + '...' 
            : firstUserMsg.text;
        }

        const newSession: ChatSession = {
          id: currentId,
          title,
          timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          messages: newMsgs
        };
        const updated = [newSession, ...nextSessions];
        localStorage.setItem('detikai_chat_sessions', JSON.stringify(updated));
        return updated;
      }

      localStorage.setItem('detikai_chat_sessions', JSON.stringify(nextSessions));
      return nextSessions;
    });
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedWithUser = [...messages, userMsg];
    updateSessionMessages(updatedWithUser);
    setInput('');
    setLoading(true);

    try {
      const payloadMessages = updatedWithUser.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages
        })
      });

      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.text || 'Gagal merespon. Maaf, respon kosong dari server.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      updateSessionMessages([...updatedWithUser, aiMsg]);

    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'ai',
        text: 'Aduh, koneksi server detikAI mengalami gangguan. Pastikan API key Anda aktif di panel Secrets.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      updateSessionMessages([...updatedWithUser, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    const clearedMsgs = [
      {
        id: `msg-welcome-new-${Date.now()}`,
        sender: 'ai' as const,
        text: 'Histori dibersihkan! Silakan ajukan pertanyaan baru Anda seputar dunia detikcom.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ];
    updateSessionMessages(clearedMsgs);
  };

  // Chat history state operations
  const startNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'Diskusi Baru',
      timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      messages: createNewMessagesList()
    };
    
    setSessions(prev => {
      const updated = [newSession, ...prev];
      localStorage.setItem('detikai_chat_sessions', JSON.stringify(updated));
      return updated;
    });
    
    setActiveSessionId(newId);
    localStorage.setItem('detikai_active_session_id', newId);
    setIsHistoryOpen(false);
  };

  const selectSession = (id: string) => {
    setActiveSessionId(id);
    localStorage.setItem('detikai_active_session_id', id);
    setIsHistoryOpen(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('detikai_chat_sessions', JSON.stringify(updated));
      
      // Determine next session to load
      if (activeSessionId === id) {
        const nextActiveId = updated.length > 0 ? updated[0].id : null;
        setActiveSessionId(nextActiveId);
        if (nextActiveId) {
          localStorage.setItem('detikai_active_session_id', nextActiveId);
        } else {
          localStorage.removeItem('detikai_active_session_id');
        }
      }
      return updated;
    });
  };

  const clearAllHistory = () => {
    localStorage.removeItem('detikai_chat_sessions');
    localStorage.removeItem('detikai_active_session_id');
    setSessions([]);
    setActiveSessionId(null);
    setIsHistoryOpen(false);
  };

  const containerClasses = embedMode 
    ? "relative w-full h-full flex flex-col justify-between bg-white overflow-hidden"
    : "relative fixed inset-0 md:inset-auto md:bottom-24 md:right-8 w-full md:w-[410px] h-[100dvh] md:h-[600px] bg-white border border-neutral-200 shadow-2xl rounded-none md:rounded-2xl z-50 flex flex-col justify-between overflow-hidden";

  return (
    <div className={containerClasses} id="detikai-chat-container">
      
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#003e6f] to-[#12386e] text-white p-4 shrink-0 flex items-center justify-between shadow-sm relative z-30">
        <div className="flex items-center space-x-2">
          {/* History Toggle Button */}
          <button
            onClick={() => setIsHistoryOpen(prev => !prev)}
            type="button"
            title="Menu Histori Chat"
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer mr-1 relative flex items-center justify-center"
          >
            <History size={18} />
            {sessions.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-purple-400 rounded-full border border-[#003e6f]"></span>
            )}
          </button>

          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
            <Sparkles size={18} className="text-purple-300 fill-purple-300/40 animate-pulse" />
          </div>
          
          <div className="text-left">
            <h3 className="font-headline font-extrabold text-xs md:text-sm leading-tight tracking-wide uppercase">detikAI Companion</h3>
            <p className="text-[10px] text-purple-200 truncate max-w-[150px] md:max-w-[200px]">{currentSession.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* New Chat directly in header */}
          <button 
            onClick={startNewChat}
            type="button"
            title="Sesi Chat Baru"
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>

          <button 
            onClick={clearChat}
            type="button"
            title="Reset Obrolan"
            className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>

          {onBackToHome && (
            <button 
              onClick={onBackToHome}
              type="button"
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Sliding Drawer Sidebar for Chat History */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            {/* Overlay Back Drop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-black/50 z-40 transition-opacity cursor-pointer"
            />

            {/* History Panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-y-0 left-0 w-72 md:w-80 bg-neutral-900 text-white z-50 shadow-2xl flex flex-col justify-between border-r border-neutral-800"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
                <div className="flex items-center space-x-2">
                  <History size={16} className="text-purple-400" />
                  <span className="font-headline font-bold text-xs uppercase tracking-wider text-neutral-300">Histori Obrolan</span>
                </div>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Action Button: Start New Chat */}
              <div className="p-3 border-b border-neutral-800">
                <button
                  type="button"
                  onClick={startNewChat}
                  className="w-full bg-gradient-to-r from-purple-700 to-[#1a4d98] text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:scale-[1.02] transform transition-transform flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Diskusi Baru</span>
                </button>
              </div>

              {/* Sessions List */}
              <div className="flex-grow overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-800">
                {sessions.length === 0 ? (
                  <div className="text-center text-neutral-500 py-10 px-4 text-xs">
                    <MessageSquare size={24} className="mx-auto text-neutral-600 mb-2 opacity-50" />
                    Belum ada riwayat diskusi. Mulai mengetik di chat untuk menyimpan histori!
                  </div>
                ) : (
                  sessions.map((sess) => {
                    const isActive = sess.id === activeSessionId;
                    return (
                      <div
                        key={sess.id}
                        onClick={() => selectSession(sess.id)}
                        className={`group relative flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border ${
                          isActive 
                            ? 'bg-neutral-800/80 border-purple-500/50 text-white font-semibold' 
                            : 'bg-neutral-900/40 border-transparent hover:bg-neutral-800/40 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-8">
                          <MessageSquare size={14} className={isActive ? 'text-purple-400' : 'text-neutral-500'} />
                          <div className="text-left min-w-0">
                            <h4 className="text-xs truncate font-medium">{sess.title}</h4>
                            <span className="text-[10px] text-neutral-500 block mt-0.5">{sess.timestamp}</span>
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button
                          type="button"
                          onClick={(e) => deleteSession(sess.id, e)}
                          title="Hapus Histori Ini"
                          className="absolute right-2 text-neutral-500 hover:text-red-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-neutral-700/50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Sidebar Footer */}
              {sessions.length > 0 && (
                <div className="p-3 border-t border-neutral-800 bg-neutral-950">
                  <button
                    type="button"
                    onClick={clearAllHistory}
                    className="w-full border border-neutral-800 hover:border-red-900 text-neutral-400 hover:text-red-400 hover:bg-red-950/20 text-[11px] font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Trash2 size={12} />
                    <span>Hapus Semua Riwayat</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Messages Feed body with enhanced scrollbars */}
      <div 
        ref={scrollRef}
        className="flex-grow bg-neutral-50/50 p-4 overflow-y-auto space-y-4 scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-300"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-1 mb-1">
                {m.sender === 'ai' && <Sparkles size={10} className="text-purple-500 shrink-0" />}
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
                  {m.sender === 'ai' ? 'detikAI' : 'Anda'}
                </span>
                <span className="text-[9px] text-neutral-400 font-mono">• {m.timestamp}</span>
              </div>
              
              <div className={`p-3 rounded-2xl text-xs md:text-sm max-w-[85%] font-medium leading-relaxed shadow-sm text-justify ${
                m.sender === 'user' 
                  ? 'bg-[#1a4d98] text-white rounded-tr-none' 
                  : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-1 mb-1">
              <span className="text-[10px] uppercase font-bold text-purple-500 animate-pulse">detikAI Sedang Mengetik</span>
            </div>
            <div className="bg-white border border-neutral-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts shortcuts section */}
      <div className="px-4 py-2 bg-white border-t border-neutral-100 shrink-0 select-none">
        <div className="flex items-center space-x-1 text-neutral-400 mb-1.5">
          <HelpCircle size={10} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Topik Cepat Populer</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent pb-1 whitespace-nowrap">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button 
              key={i}
              type="button"
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/50 py-1 px-2.5 rounded-full text-[10px] font-bold shrink-0 transition-colors select-none cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* TextInput footer */}
      <form 
        onSubmit={handleFormSubmit}
        className="p-3 bg-white border-t border-neutral-200 shrink-0 flex items-center space-x-2"
      >
        <input 
          type="text" 
          placeholder="Tanya apapun tentang berita hari ini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-grow bg-neutral-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:bg-neutral-50 focus:ring-1 focus:ring-[#1a4d98] focus:border-[#1a4d98] text-neutral-800 placeholder-neutral-400"
        />
        <button 
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-gradient-to-r from-[#1a4d98] to-[#ff4f00] hover:scale-105 active:scale-95 text-white p-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50 select-none cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send size={15} />
        </button>
      </form>

    </div>
  );
}
