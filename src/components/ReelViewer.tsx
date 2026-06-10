import React, { useState, useEffect } from 'react';
import { Reel } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReelViewerProps {
  reels: Reel[];
  initialReelId: string;
  onClose: () => void;
}

export default function ReelViewer({ reels, initialReelId, onClose }: ReelViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = reels.findIndex(r => r.id === initialReelId);
    return idx !== -1 ? idx : 0;
  });
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const activeReel = reels[currentIndex];

  useEffect(() => {
    setProgress(0);
    setAiResponse('');
    setAiQuestion('');
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1.25; // Controls the speed of standard 8-second story auto-slide
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setProgress(100);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setProgress(0);
    }
  };

  const askDetikAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setIsAsking(true);
    setIsPlaying(false); // Pause story while asking
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ id: '1', sender: 'user', text: aiQuestion }],
          articleTitle: activeReel.title,
          articleContent: `Topik cerita singkat Reels: ${activeReel.title}. Deskripsi visual: ${activeReel.imageAlt}`
        })
      });
      const data = await res.json();
      setAiResponse(data.text);
    } catch (err) {
      setAiResponse('Gagal menghubungi detikAI. Silakan cek koneksi Anda.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-0 md:p-4">
      <div className="relative w-full max-w-md h-full md:h-[85vh] bg-neutral-900 rounded-none md:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-800">
        
        {/* Progress Bars Indicator */}
        <div className="absolute top-3 left-4 right-4 z-40 flex space-x-1.5">
          {reels.map((reel, rIdx) => {
            let barProg = 0;
            if (rIdx < currentIndex) barProg = 100;
            if (rIdx === currentIndex) barProg = progress;
            return (
              <div key={reel.id} className="h-1 bg-white/30 rounded-full flex-grow overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: `${barProg}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Top Header controls */}
        <div className="absolute top-8 left-4 right-4 z-30 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#1a4d98] flex items-center justify-center border border-white/20 select-none">
              <span className="text-white text-[10px] font-extrabold font-headline leading-none">detik</span>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">{activeReel.sourceLabel || "detikcom Reels"}</p>
              <p className="text-white/75 text-[10px]">Hari ini • Live video</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Story Body Image & Overlays */}
        <div className="relative flex-grow flex items-center justify-center overflow-hidden">
          <img 
            src={activeReel.imageUrl} 
            alt={activeReel.imageAlt}
            className="w-full h-full object-cover"
          />
          {/* Gradients to shadow controls */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-neutral-950/90 z-10" />

          {/* Navigational chevron left/right */}
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="absolute left-2 z-30 text-white/50 hover:text-white p-2 md:p-3 disabled:opacity-0"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentIndex === reels.length - 1}
            className="absolute right-2 z-30 text-white/50 hover:text-white p-2 md:p-3 disabled:opacity-0"
          >
            <ChevronRight size={32} />
          </button>

          {/* Story Title Card Text OVERLAY */}
          <div className="absolute bottom-36 left-4 right-4 z-20">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              key={activeReel.id}
              className="bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10"
            >
              <span className="inline-block bg-[#ff4f00] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider mb-2">
                REELS EXCLUSIVE
              </span>
              <h2 className="text-white font-headline text-base font-bold leading-snug">
                {activeReel.title}
              </h2>
              <p className="text-white/80 text-[11px] mt-1 line-clamp-2">
                {activeReel.imageAlt}
              </p>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM PANEL: Ask detikAI specific questions about this scene! */}
        <div className="relative bg-neutral-950 border-t border-neutral-800 p-4 z-30 shrink-0">
          <div className="flex items-center space-x-1 mb-2">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wide">Tanya detikAI untuk Reels ini</span>
          </div>

          <form onSubmit={askDetikAI} className="flex space-x-2">
            <input 
              type="text" 
              placeholder="Bagaimana kelanjutan berita ini?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="flex-grow bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
            <button 
              type="submit"
              disabled={isAsking}
              className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors disabled:opacity-70"
            >
              {isAsking ? '...' : 'Tanya'}
            </button>
          </form>

          {/* AI Response popup */}
          <AnimatePresence>
            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-purple-950/30 border border-purple-900/40 p-2.5 rounded-lg text-neutral-200 text-xs text-left"
              >
                <div className="flex items-center justify-between mb-1 text-[10px] text-purple-400 font-bold">
                  <span>detikAI:</span>
                  <button onClick={() => setAiResponse('')} className="text-neutral-400 hover:text-white">tutup</button>
                </div>
                <p className="leading-relaxed leading-normal">{aiResponse}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
