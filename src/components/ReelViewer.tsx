import React, { useState, useEffect, useRef } from 'react';
import { Reel } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  ChevronUp, 
  ChevronDown,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReelViewerProps {
  reels: Reel[];
  initialReelId: string;
  onClose: () => void;
  onSearchAi?: (query: string) => void;
}

// Simulated comments mapped to reel ids
const SIMULATED_COMMENTS: Record<string, { user: string; text: string; time: string }[]> = {
  'reel-1': [
    { user: '@budi.santoso', text: 'Serem banget, perusak fasilitas umum harus ditindak tegas!', time: '2j' },
    { user: '@ayu_lestari', text: 'Kacau ya, kasihan lansia yang mau naik lift.', time: '4j' }
  ],
  'reel-2': [
    { user: '@hendra_w', text: 'Wah, info bagus nih buat yang nunggak BPJS.', time: '1j' },
    { user: '@siti_aminah', text: 'Semoga mekanismenya gak ribet ya besok.', time: '3j' }
  ],
  'reel-3': [
    { user: '@tekonologi_ID', text: 'Tim Cook legendaris banget memo terakhirnya bikin haru.', time: '10m' },
    { user: '@apple_fanboy', text: 'Ditunggu inovasi on-device AI dari CEO barunya!', time: '1j' }
  ],
  'reel-4': [
    { user: '@cantik_alam', text: 'Gokil, teknologi makin membantu banget buat skincare.', time: '2j' },
    { user: '@dr.rahma', text: 'AI ini beneran akurat kok buat diagnosis awal.', time: '5j' }
  ],
  'reel-5': [
    { user: '@timnas_mania', text: 'Yamal beneran wonderkid abad ini sih.', time: '12m' },
    { user: '@bola_explorer', text: 'Aman panggul paha 15% hemat energi emang ngeri taktik larinya.', time: '4h' }
  ]
};

export default function ReelViewer({ reels, initialReelId, onClose, onSearchAi }: ReelViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = reels.findIndex(r => r.id === initialReelId);
    return idx !== -1 ? idx : 0;
  });
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aiQuestion, setAiQuestion] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [bookmarkMap, setBookmarkMap] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showPlayStateIndicator, setShowPlayStateIndicator] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [customComments, setCustomComments] = useState<Record<string, { user: string; text: string; time: string }[]>>({});

  const activeReel = reels[currentIndex];
  const audioProgressRef = useRef<number>(0);

  // Reset progress and localized view settings when changing active reel
  useEffect(() => {
    setProgress(0);
    setAiQuestion('');
    setCopiedShare(false);
  }, [currentIndex]);

  // Video progress timeline bar simulation
  useEffect(() => {
    if (!isPlaying || showComments) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1.25; // Continuous seek bar simulation
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, showComments]);

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

  const togglePlayState = () => {
    setIsPlaying(!isPlaying);
    setShowPlayStateIndicator(true);
    setTimeout(() => {
      setShowPlayStateIndicator(false);
    }, 600);
  };

  const toggleLikeReel = (id: string) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmarkReel = (id: string) => {
    setBookmarkMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const askDetikAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    if (onSearchAi) {
      const fullQuery = `Mengenai Reels "${activeReel.title}": ${aiQuestion.trim()}`;
      onSearchAi(fullQuery);
      onClose(); // Close the reels viewer to reveal the AI companion
    }
  };

  const handleShareReel = (title: string) => {
    setCopiedShare(true);
    navigator.clipboard.writeText(`Lihat Reels terbaru di detikcom: "${title}" - Temukan berita terhangat dengan asisten detikAI!`);
    setTimeout(() => {
      setCopiedShare(false);
    }, 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      user: '@pengguna_detik',
      text: commentInput.trim(),
      time: '1detik'
    };

    setCustomComments(prev => {
      const currentList = prev[activeReel.id] || SIMULATED_COMMENTS[activeReel.id] || [];
      return {
        ...prev,
        [activeReel.id]: [newComment, ...currentList]
      };
    });

    setCommentInput('');
  };

  if (!activeReel) {
    return null;
  }

  const currentCommentsList = customComments[activeReel.id] || SIMULATED_COMMENTS[activeReel.id] || [];

  return (
    <div className="fixed inset-0 bg-neutral-950/98 z-50 flex items-center justify-center p-0 md:p-3 select-none">
      
      {/* Background overlay click-to-close on desktop */}
      <div className="absolute inset-0 bg-black/80 hidden md:block cursor-pointer" onClick={onClose} />

      {/* Main vertical video container */}
      <div className="relative w-full max-w-[430px] h-full md:h-[880px] bg-neutral-900 rounded-none md:rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl border border-neutral-800/80 z-20">
        
        {/* Top Header controls (Immersive transparent overlay) */}
        <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent p-2 pb-6 -mx-4 -mt-4">
          <div className="flex items-center space-x-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-[#1a4d98] flex items-center justify-center border border-white/20 select-none shadow-md">
              <span className="text-white text-[9px] font-black font-headline leading-none">detik</span>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">{activeReel.sourceLabel || "detikcom Reels"}</p>
              <p className="text-white/60 text-[9px] mt-0.5 flex items-center space-x-1">
                <span className="inline-block w-1.5 h-1.5 bg-[#ff4f00] rounded-full animate-ping" />
                <span>Hari ini • Live Video</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 pr-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors bg-black/20"
              title={isMuted ? "Suara Off" : "Suara On"}
            >
              {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/10 p-2 rounded-full transition-colors bg-black/20"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Image Canvas (Plays role as vertical video placeholder) */}
        <div 
          onClick={togglePlayState}
          className="relative flex-grow flex items-center justify-center overflow-hidden cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeReel.id}
              initial={{ opacity: 0.8, filter: 'blur(5px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
              src={activeReel.imageUrl} 
              alt={activeReel.imageAlt}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Vignette bottom gradient overlay to keep texts perfectly legible */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Centered Dynamic Play Pause State Animation Icon */}
          <AnimatePresence>
            {showPlayStateIndicator && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute z-40 bg-black/60 backdrop-blur-sm p-4 rounded-full border border-white/20 text-white"
              >
                {isPlaying ? <Play size={28} fill="currentColor" /> : <Pause size={28} fill="currentColor" />}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vertical Reels Swiper Controls (Overlay Arrows) */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-950/80 text-white border border-white/15 disabled:opacity-20 transition-all cursor-pointer shadow-md"
              title="Reels Atas"
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex === reels.length - 1}
              className="p-2 rounded-full bg-neutral-900/60 hover:bg-neutral-950/80 text-white border border-white/15 disabled:opacity-20 transition-all cursor-pointer shadow-md"
              title="Reels Bawah"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* RIGHT SIDE TIKTOK-STYLE OVERLAY ACTIONS */}
          <div className="absolute right-3.5 bottom-12 z-30 flex flex-col items-center space-y-4">
            
            {/* Publisher Avatar & Follow lockup */}
            <div className="flex flex-col items-center mb-1">
              <div className="relative w-10 h-10 rounded-full border-2 border-white bg-[#ff4f00] flex items-center justify-center font-headline text-xs text-white font-extrabold shadow-lg">
                detik
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Mengikuti detikcom!");
                  }}
                  className="absolute -bottom-1.5 bg-purple-600 hover:bg-purple-500 rounded-full text-white p-0.5 border border-white flex items-center justify-center transform active:scale-90"
                >
                  <Plus size={10} />
                </button>
              </div>
            </div>

            {/* Like Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLikeReel(activeReel.id);
              }}
              className="flex flex-col items-center focus:outline-none group text-white cursor-pointer"
            >
              <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/35 transition-all text-neutral-200 hover:scale-110 active:scale-95 ${likedMap[activeReel.id] ? 'bg-red-600 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]' : ''}`}>
                <Heart size={20} className={likedMap[activeReel.id] ? 'fill-white' : 'group-hover:text-red-400'} />
              </div>
              <span className="text-[10px] font-black mt-1 shadow-sm text-shadow">
                {likedMap[activeReel.id] ? '1,543' : '1,542'}
              </span>
            </button>

            {/* Comments Drawer Toggle Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(true);
              }}
              className="flex flex-col items-center focus:outline-none group text-white cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/35 transition-all text-neutral-200 hover:scale-110 active:scale-95">
                <MessageCircle size={20} className="group-hover:text-purple-400" />
              </div>
              <span className="text-[10px] font-black mt-1 text-shadow">
                {currentCommentsList.length}
              </span>
            </button>

            {/* Bookmark Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmarkReel(activeReel.id);
              }}
              className="flex flex-col items-center focus:outline-none group text-white cursor-pointer"
            >
              <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/35 transition-all text-neutral-200 hover:scale-110 active:scale-95 ${bookmarkMap[activeReel.id] ? 'bg-yellow-500 text-white border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.5)]' : ''}`}>
                <Bookmark size={20} className={bookmarkMap[activeReel.id] ? 'fill-white' : ''} />
              </div>
              <span className="text-[10px] font-black mt-1 text-shadow">
                {bookmarkMap[activeReel.id] ? '124' : '123'}
              </span>
            </button>

            {/* Copy Share Action */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleShareReel(activeReel.title);
              }}
              className="flex flex-col items-center focus:outline-none group text-white relative cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/35 transition-all text-neutral-200 hover:scale-110 active:scale-95">
                <Share2 size={20} className="group-hover:text-blue-400" />
              </div>
              <span className="text-[10px] font-black mt-1 text-shadow">
                {copiedShare ? 'Tersalin!' : 'Bagikan'}
              </span>
            </button>

          </div>

          {/* LEFT BOTTOM METADATA CARD HEADER AND INFOS WITH INTEGRATED AI INPUT BOX */}
          <div className="absolute bottom-6 left-4 right-20 z-25 text-left pointer-events-auto select-text">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }}
              key={activeReel.id}
              className="bg-neutral-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <span className="inline-block bg-[#ff4f00] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    REELS TV
                  </span>
                  <span className="text-white/60 text-[9px]">• Terverifikasi</span>
                </div>
                <h2 className="text-white font-headline text-xs font-bold leading-snug tracking-normal line-clamp-1">
                  {activeReel.title}
                </h2>
                <p className="text-white/80 text-[10.5px] mt-0.5 line-clamp-2 leading-normal">
                  {activeReel.imageAlt}
                </p>
              </div>

              {/* INTEGRATED INSTANT ASK BAR (detikAI Integration) */}
              <form 
                onSubmit={askDetikAI} 
                className="flex items-center space-x-1.5 pt-2 border-t border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-grow flex items-center bg-white/5 border border-white/10 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/10 rounded-xl transition-all duration-300">
                  <input 
                    type="text" 
                    placeholder="Tanya detikAI tentang Reels ini..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="w-full bg-transparent px-2.5 py-1.5 text-[11px] text-white placeholder-neutral-400 focus:outline-none font-sans font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] text-white p-1.5 rounded-xl transition-all active:scale-95 flex items-center justify-center shrink-0 cursor-pointer h-7 w-7"
                >
                  <Sparkles size={11} className="fill-white/10 animate-pulse" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Bottom horizontal video slide progress indicator bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60 z-30">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-[#ff4f00] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        {/* MOCK COMMENTS DRAWER / COLLAPSIBLE PANEL */}
        <AnimatePresence>
          {showComments && (
            <>
              {/* Back backdrop click-to-dismiss */}
              <div className="absolute inset-0 bg-black/40 z-45" onClick={() => setShowComments(false)} />
              
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="absolute left-0 right-0 bottom-0 h-[60%] bg-neutral-900 border-t border-neutral-800 rounded-t-3xl z-50 flex flex-col justify-between"
              >
                {/* Drawer Drag line & title */}
                <div className="p-3 text-center border-b border-neutral-800 flex items-center justify-between px-4">
                  <div className="w-6" /> {/* spacer */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-1 bg-neutral-700 rounded-full mb-1" />
                    <span className="text-white text-xs font-bold font-headline">Komentar ({currentCommentsList.length})</span>
                  </div>
                  <button 
                    onClick={() => setShowComments(false)} 
                    className="text-neutral-400 hover:text-white text-xs bg-neutral-800 p-1 rounded-full cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Comments scroll area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3.5 no-scrollbar scroll-smooth">
                  {currentCommentsList.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500 text-xs text-sans">
                      Belum ada komentar. Tulis komentar pertama kamu!
                    </div>
                  ) : (
                    currentCommentsList.map((c, index) => (
                      <div key={index} className="flex space-x-2.5 items-start text-left">
                        <div className="w-7 h-7 rounded-full bg-neutral-800 text-purple-400 text-[10px] font-black uppercase flex items-center justify-center border border-purple-500/20 select-none">
                          {c.user.substring(1, 3)}
                        </div>
                        <div className="flex-grow bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/60">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-purple-400 text-[11px] font-black font-headline">{c.user}</span>
                            <span className="text-neutral-500 text-[9px]">{c.time}</span>
                          </div>
                          <p className="text-white/90 text-xs font-sans leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment field form */}
                <form onSubmit={handleSubmitComment} className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center space-x-2 pb-5">
                  <input 
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tulis komentar positif kamu..."
                    className="flex-grow bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                  <button 
                    type="submit"
                    className="bg-[#ff4f00] hover:bg-[#e04500] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Kirim
                  </button>
                </form>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
