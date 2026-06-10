import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, X, Send, Command, RefreshCw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AICompanionProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'Ringkas masalah lift JPO Lenteng Agung',
  'Apa rencana pemutihan iuran BPJS Kesehatan?',
  'Tim Cook mundur? Siapa suksesor Apple?',
  'Bagaimana penerapan AI kecantikan kulit?'
];

export default function AICompanion({ onClose }: AICompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initial welcome message
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: 'Halo! Saya detikAI, asisten cerdas digital detikcom. Saya tahu segalanya tentang berita-berita terakurat hari ini! Anda bisa bertanya tentang artikel di portal, rangkuman harian, atau topik apapun. Ada yang bisa saya bantu?',
        timestamp: new Date().toLocaleTimeString('id-UID', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest bubble
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-UID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build context of standard chat thread
      const payloadMessages = [...messages, userMsg].map(m => ({
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
        timestamp: new Date().toLocaleTimeString('id-UID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-error-${Date.now()}`,
        sender: 'ai',
        text: 'Aduh, koneksi server detikAI mengalami gangguan. Pastikan API key Anda aktif di panel Secrets.',
        timestamp: new Date().toLocaleTimeString('id-UID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'ai',
        text: 'Histori dibersihkan! Silakan ajukan pertanyaan baru Anda seputar dunia detikcom.',
        timestamp: new Date().toLocaleTimeString('id-UID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 w-full md:w-[410px] h-[100dvh] md:h-[600px] bg-white border border-neutral-200 shadow-2xl rounded-none md:rounded-2xl z-50 flex flex-col justify-between overflow-hidden">
      
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-[#003e6f] to-purple-800 text-white p-4 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
            <Sparkles size={18} className="text-purple-300 fill-purple-300/40 animate-pulse" />
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-sm leading-tight tracking-wide uppercase">detikAI Companion</h3>
            <p className="text-[10px] text-purple-200">Asisten Digital Berita Cerdas Terupdate</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={clearChat}
            title="Bersihkan Percakapan"
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
          </button>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Feed body */}
      <div 
        ref={scrollRef}
        className="flex-grow bg-neutral-50/50 p-4 overflow-y-auto no-scrollbar space-y-4"
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
      <div className="px-4 py-2 bg-white border-t border-neutral-100 shrink-0">
        <div className="flex items-center space-x-1 text-neutral-400 mb-1.5">
          <HelpCircle size={10} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Topik Cepat Populer</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
          {SUGGESTED_PROMPTS.map((p, i) => (
            <button 
              key={i}
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
