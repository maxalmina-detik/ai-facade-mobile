import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Check,
  Headphones,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MilidetikTabProps {
  onReadArticle?: (id: string) => void;
  onSearchAi?: (query: string) => void;
}

const SUGGESTIONS_MAP: Record<string, string[]> = {
  'mili-1': [
    'Siapa terduga pelaku perusakan?',
    'Bagaimana kondisi pengguna JPO?',
    'Kapan JPO diperbaiki?'
  ],
  'mili-2': [
    'Apa syarat denda BPJS dihapus?',
    'Apakah iuran BPJS akan dinaikkan?',
    'Mekanisme penghapusan denda'
  ],
  'mili-3': [
    'Siapa kandidat terkuat CEO Apple?',
    'Mengapa Tim Cook mengundurkan diri?',
    'Kapan Apple merilis on-device AI?'
  ],
  'mili-4': [
    'Bagaimana cara kerja AI deteksi kulit?',
    'Di mana mendapatkan perangkat penganalisis?',
    'Apa tanggapan Nikita Willy tentang AI?'
  ],
  'mili-5': [
    'Berapa target gol Yamal di Piala Dunia?',
    'Bagaimana taktik lari eksplosif Yamal?',
    'Apakah La Roja dijagokan juara?'
  ]
};

interface MilidetikCard {
  id: string;
  articleId: string;
  title: string;
  category: string;
  tagColor: string;
  imageUrl: string;
  imageAlt: string;
  readTime: string;
  likesInitial: number;
  bullets: string[];
}

const MILIDETIK_CARDS: MilidetikCard[] = [
  {
    id: 'mili-1',
    articleId: 'art-1',
    title: 'Kabel Lift JPO Lenteng Agung Sengaja Dipotong Pelaku Vandalisme',
    category: 'detikNews',
    tagColor: 'bg-red-600',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUWb9YqOpIwzu56GX6udDM2XxmzB9B3NVUpjyhXxOAL0qe8OVFDykOTOiCmEyTz7w1Q_JN9pTSyyOtLJmquHFt7LgG-y5jiuRULeSbPAnwosbdkZJvApNklpIBWcfdWuj4kE0pGavv7N_ho4KYjomn2pmfPCli0PHKr9FCBory3MzOEZr9qxYQq8WxXcPOaedS92KWmBEOUSc06bJQOJmvAyIwfl_XHK7J0fFLrIUVyX-m4vY3CD_XeaswO1Ag0inojpkmALh28qc',
    imageAlt: 'Pramono Anung berbicara di hadapan mikrofon terkait perusakan lift.',
    readTime: '15 Mdtk Baca',
    likesInitial: 348,
    bullets: [
      'Penyelidikan mendalam dimulai setelah kabel sensor dan tenaga lift di JPO Lenteng Agung dipotong secara sengaja.',
      'Fasilitas publik vital terganggu penuh, menyulitkan kelompok prioritas seperti disabilitas, lansia, dan ibu hamil.',
      'Pramono Anung mendesak kepolisian setempat segera memeriksa seluruh sudut rekaman CCTV untuk menangkap pelaku.'
    ]
  },
  {
    id: 'mili-2',
    articleId: 'art-2',
    title: 'Rencana Pemutihan Tunggakan Iuran BPJS Kesehatan Sedang Dimatangkan',
    category: 'Detik Pagi',
    tagColor: 'bg-orange-600',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO82aQtcON-TWLQDLjuZ3okjGYc8uh-_UE7Q97K1wJwi0Bl2QFPGYdmgXpvFSGzvfUa12XKIRwsVZH3zGFTLO-xRagwokRgSEKqD62vFCuqR176_ZI4gVZ-jDFIeV2tDWDzOVQyDxwhx3sRNsPoQAdm3GZqgF-AGA8EJk39bF9NLjFFazKjdWJRvyXJ7cWEeu-70aOMf_k9ytYNxvPhaQ-vuWaGVS9MfNvnXVgxR9lbEXC0VXGt5EIQjhkAqOtSUHWPYcKe-prU7Y',
    imageAlt: 'Presenter Detik Pagi dalam studio menyiarkan berita BPJS.',
    readTime: '12 Mdtk Baca',
    likesInitial: 198,
    bullets: [
      'Pemerintah bersama DJSN mematangkan draf penghapusan denda dan tunggakan lama untuk meringankan masyarakat.',
      'Langkah taktis ini dirancang agar status kesehatan masyarakat tidak terblokir saat membutuhkan situasi darurat.',
      'Regulasi resmi dan mekanisme pendaftaran dijadwalkan meluncur serentak di akhir bulan Juni 2026.'
    ]
  },
  {
    id: 'mili-3',
    articleId: 'art-3',
    title: 'Tim Apple Sambut Suksesi CEO Baru, Tim Cook Sebar Memo Haru',
    category: 'detikInet',
    tagColor: 'bg-purple-600',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-uWLIKfGFrAAY9V_Vjytn-KEcGodcFTvXOyM-uH-vlcZHldJDMw1jgfucyh3rU4emdz7dWkyWj60gpR-KzdwHtsugKWlsLF5GW6TISwJEnBOrUvqrhLqDEWXn4d0o1wYDLZtdN2QA9SForTCK1knINhaLgl-OJ2fKNdo_fYiUsy0Ia5woM6iMuPDWrs3M6OSZ9J26pVHjDlE7CXWdM1YoyWTTtekHiGmqQVVsKzItOCGuF3JPeGMujCsA3bOh4JDUVIJ-Qtm25DI',
    imageAlt: 'CEO Apple Tim Cook tersenyum mengenakan baju hitam berpakaian necis.',
    readTime: '15 Mdtk Baca',
    likesInitial: 549,
    bullets: [
      'Tim Cook resmi merilis peta jalan pengunduran dirinya dan suksesi kepemimpinan Apple berskala global.',
      'Dalam pesan internalnya, ia menyanjung kolaborasi insinyur dunia yang tekun merajut hardware yang humanis.',
      'Para pemegang saham memprediksi suksesor berikutnya akan berfokus penuh meledakkan ekosistem AI on-device lokal.'
    ]
  },
  {
    id: 'mili-4',
    articleId: 'art-4',
    title: 'Inovasi AI Deteksi Keadaan Kulit Sensitif Hanya dalam 10 Detik',
    category: 'Lifestyle',
    tagColor: 'bg-rose-500',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2d0VIcOm355R520OdEFJNMLZ5R520OdEFJNMLZ0_vDVmlX2JeMpVNDqWRNo30PoSsdz1na3AWKZFzn4efcRmOqCBrM3BhkpyKE0RwX3UuY7lGqzu0z8aTS13QDpg1UkSAOkT1y53DPON5UnLcslium47bM_Mg_NHNpCMK6sXn6aKmsifXMeTxP_RdXsNb7ZNB56--KWIrldcTkuOeP1pzhxnQZLx9c_0DJwOGiJQ_vb5v0NqteEVxJCxHvtQMYs93M3jvFxj4MUkvOLlzi4WkPJQxM',
    imageAlt: 'Nikita Willy memeriksa parameter kelembaban kulit via layar canggih AI.',
    readTime: '10 Mdtk Baca',
    likesInitial: 421,
    bullets: [
      'Perangkat penganalisis genggam pintar merevolusi klinik dermatologi lewat kecocokan instan data mikro.',
      'Aktris Nikita Willy takjub melihat akurasi diagnosis pori kulitnya yang sensitif secara instan.',
      'Konsumen sangat menyambut kegunaan alat ini agar terhindar dari pemborosan produk kosmetik alergi.'
    ]
  },
  {
    id: 'mili-5',
    articleId: 'art-5',
    title: 'Lamine Yamal Janjikan Kejayaan Spanyol di Pentas Piala Dunia 2026',
    category: 'detikSport',
    tagColor: 'bg-blue-600',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiWjc-53xx46S7qz7rgJoJOabtFiRHlknhaUGY8zAXRkUQ-rFQRvBMnauIYZaK2pYQoTEGEATAEgduQbAzKGv4pWfxtZMHJAsRiKRVYy8XgxIppBLanPMQk_nCl50C_cB2YqLYq9BTKMqppIaYqGWwmeWFrvQU0uxRn7FXOXKUvbP03KR8PVI5vjSt_VU3N7mznvZebLmotYzsTKwRAZKs5hU_pfn9Xtz_Riab7J-yKVyUMb9-KSbeE5fw28trnGTGrYH38LIqNeI',
    imageAlt: 'Yamal mengenakan seragam biru merah di lapangan hijau bersiap mengocek bola.',
    readTime: '15 Mdtk Baca',
    likesInitial: 1205,
    bullets: [
      'Wonderkid andalan La Roja mengunci fokus demi membawa piala megah sepak bola pulang kembali.',
      'Taktik lari eksplosif Yamal terbukti ilmiah mampu menghemat energi sebesar 15% pada bagian paha panggul.',
      'Penggemar menyambutnya sebagai kaisar penyerang sayap baru pemicu adrenalin dengan gocekan murni luar biasa.'
    ]
  }
];

export default function MilidetikTab({ onReadArticle, onSearchAi }: MilidetikTabProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const [suggestionQuery, setSuggestionQuery] = useState('');

  const activeCard = MILIDETIK_CARDS[activeIndex];

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSpeed, setAudioSpeed] = useState(1);

  // Stop active speech and reset progress when index changes
  useEffect(() => {
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
      setAudioProgress(0);
    }
  }, [activeIndex]);

  // Handle clean-up when component is unmounted
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Update progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAudioPlaying) {
      const textToRead = `${activeCard.title}. ${activeCard.bullets.join('. ')}`;
      const totalEstimatedSeconds = (textToRead.length * 0.08) / audioSpeed;
      const stepMs = 200;
      const stepPercent = (stepMs / 1000 / totalEstimatedSeconds) * 100;

      timer = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsAudioPlaying(false);
            window.speechSynthesis?.cancel();
            return 0;
          }
          return prev + stepPercent;
        });
      }, stepMs);
    }
    return () => clearInterval(timer);
  }, [isAudioPlaying, audioSpeed, activeCard]);

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
    } else {
      window.speechSynthesis?.cancel();
      const textToRead = `Mili detik detik com. ${activeCard.title}. Poin pertama: ${activeCard.bullets[0]}. Poin kedua: ${activeCard.bullets[1]}. Poin ketiga: ${activeCard.bullets[2] || ''}`;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = audioSpeed;
      
      utterance.onend = () => {
        setIsAudioPlaying(false);
        setAudioProgress(0);
      };
      utterance.onerror = () => {
        setIsAudioPlaying(false);
      };

      window.speechSynthesis?.speak(utterance);
      setIsAudioPlaying(true);
    }
  };

  const cycleSpeed = () => {
    let nextSpeed = 1;
    if (audioSpeed === 1) nextSpeed = 1.25;
    else if (audioSpeed === 1.25) nextSpeed = 1.5;
    else if (audioSpeed === 1.5) nextSpeed = 2;
    
    setAudioSpeed(nextSpeed);
    
    // If audio is playing, restart with new speed
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      
      const textToRead = `Mili detik detik com. ${activeCard.title}. Poin pertama: ${activeCard.bullets[0]}. Poin kedua: ${activeCard.bullets[1]}. Poin ketiga: ${activeCard.bullets[2] || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = nextSpeed;
      utterance.onend = () => {
        setIsAudioPlaying(false);
        setAudioProgress(0);
      };
      utterance.onerror = () => {
        setIsAudioPlaying(false);
      };
      window.speechSynthesis?.speak(utterance);
    }
  };

  // Up/Down control triggers
  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < MILIDETIK_CARDS.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  // Touch handlers for responsive swiping experience
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStart === null) return;
    const swipeEnd = e.changedTouches[0].clientY;
    const diff = swipeStart - swipeEnd;

    if (diff > 50) {
      // Swipe Up -> Next News
      handleNext();
    } else if (diff < -50) {
      // Swipe Down -> Prev News
      handlePrev();
    }
    setSwipeStart(null);
  };

  // Keyboard navigation support if element receives focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const toggleLikeCard = (id: string) => {
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (title: string, id: string) => {
    navigator.clipboard.writeText(`${title} - Tonton berita instan selengkapnya hanya di MiliDetik.`);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div 
      className="w-full h-full flex flex-col justify-between bg-neutral-950 text-white overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Experience Banner */}
      <div className="absolute top-2 left-0 right-0 z-30 px-4 flex justify-between items-center bg-transparent shrink-0">
        <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md py-1 px-3 rounded-full border border-white/10">
          <Zap size={12} className="text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-100">MiliDetik</span>
          <span className="text-neutral-400 text-[9px] font-mono">• Kabar Instan</span>
        </div>
      </div>

      {/* Main card stage area with slide transitions */}
      <div className="flex-grow w-full h-full relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, info) => {
              const swipeThreshold = 80;
              if (info.offset.y < -swipeThreshold) {
                handleNext();
              } else if (info.offset.y > swipeThreshold) {
                handlePrev();
              }
            }}
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -150 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-end cursor-grab active:cursor-grabbing"
          >
            {/* Background Fullscreen Image with sharp crop */}
            <div className="absolute inset-0 w-full h-full bg-neutral-900 z-0 select-none pointer-events-none">
              <img 
                src={activeCard.imageUrl} 
                alt={activeCard.imageAlt}
                className="w-full h-full object-cover scale-102 filter brightness-[0.75] select-none"
                referrerPolicy="no-referrer"
              />
              {/* Complex heavy dark gradients for ultimate readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-black/40 z-10" />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950/50 to-transparent z-10" />
            </div>

            {/* Content Foreground info box with absolute single-container scrollability */}
            <div className="relative z-20 px-4 md:px-6 pb-2 pt-10 w-full h-full max-w-xl mx-auto flex flex-col justify-end overflow-hidden pointer-events-none">
              
              {/* Consolidated single scrollable container holding both text content and prompt/media interactives */}
              {/* We avoid 'justify-end' directly on scrollable elements to prevent top content clipping / data loss in flexbox */}
              <div className="overflow-y-auto no-scrollbar space-y-3 text-left pointer-events-auto max-h-full pb-3 flex flex-col">
                
                {/* Invisible elastic spacer to align content to the bottom on tall screens, transitioning naturally on scroll */}
                <div className="flex-grow min-h-[4px]" />

                {/* 1. PRIMARY ARTICLE HEADING & BULLETS CHUNKS */}
                <div className="space-y-2.5">
                  {/* Category tag */}
                  <div className="flex items-center space-x-2">
                    <span className={`${activeCard.tagColor} text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm`}>
                      {activeCard.category}
                    </span>
                    <span className="text-[10px] text-neutral-300 font-mono italic">
                      {activeCard.readTime}
                    </span>
                  </div>

                  {/* Display Title */}
                  <h2 className="font-headline font-black text-sm md:text-base leading-snug text-neutral-50 tracking-tight glow-subtle">
                    {activeCard.title}
                  </h2>

                  {/* MILIDETIK 3 HIGHLIGHT BULLET POINTS */}
                  <div className="space-y-2 pt-1">
                    {activeCard.bullets.map((bullet, bIdx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + bIdx * 0.1 }}
                        key={bIdx}
                        className="flex items-start space-x-2"
                      >
                        <div className="flex-shrink-0 w-4 h-4 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 font-mono text-[9px] font-bold mt-0.5 shadow-sm">
                          {bIdx + 1}
                        </div>
                        <p className="text-xs text-neutral-200 font-medium leading-relaxed text-justify">
                          {bullet}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions and Read More linkage */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/5 gap-2">
                    
                    {/* Baca Selengkapnya action button linking directly to detail view */}
                    {onReadArticle && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onReadArticle(activeCard.articleId);
                        }}
                        type="button"
                        className="flex-grow bg-[#ff4f00] hover:bg-[#e04500] text-white py-1.5 px-3 rounded-lg text-[11px] font-black shadow-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer transform hover:scale-[1.01] active:scale-98 select-none"
                      >
                        <BookOpen size={11} />
                        <span>Baca Berita Lengkap</span>
                      </button>
                    )}

                    {/* Like Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeCard(activeCard.id);
                      }}
                      type="button"
                      title="Sukai Berita"
                      className={`p-2 rounded-lg border transition-all flex items-center justify-center space-x-1 cursor-pointer select-none ${
                        likedMap[activeCard.id] 
                          ? 'bg-purple-600 border-purple-500 text-white scale-102' 
                          : 'bg-black/30 border-white/10 hover:border-white/20 text-neutral-300'
                      }`}
                    >
                      <ThumbsUp size={11} className={likedMap[activeCard.id] ? 'fill-white' : ''} />
                      <span className="text-[9px] font-extrabold">
                        {activeCard.likesInitial + (likedMap[activeCard.id] ? 1 : 0)}
                      </span>
                    </button>

                    {/* Share Button with copied indicator */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(activeCard.title, activeCard.id);
                      }}
                      type="button"
                      title="Bagikan Ringkasan"
                      className="p-2 rounded-lg bg-black/30 border border-white/10 hover:border-white/20 text-neutral-300 transition-all flex items-center justify-center cursor-pointer select-none"
                    >
                      {copiedMap[activeCard.id] ? (
                        <Check size={11} className="text-green-400" />
                      ) : (
                        <Share2 size={11} />
                      )}
                    </button>

                  </div>
                </div>

                {/* 2. CONTEXTUAL AUDIO PLAYER & FLOATING INPUT INQUIRY FORM */}
                <div className="space-y-2 flex flex-col pt-2 border-t border-white/5">
                  
                  {/* COMPACT PREMIUM AUDIO PLAYER (detikVoice) - Fully Simplified containing no overlapping text */}
                  <div className="bg-[#121212]/95 border border-neutral-800 rounded-xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] flex items-center space-x-2 select-none">
                    {/* Play/Pause control */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAudio();
                      }}
                      type="button"
                      className="w-7 h-7 rounded-full bg-purple-600 hover:bg-purple-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0 focus:outline-none"
                      title={isAudioPlaying ? "Pause Suara" : "Putar Suara"}
                    >
                      {isAudioPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} className="ml-0.5" fill="currentColor" />}
                    </button>

                    {/* Icon & Mini identifier */}
                    <div className="flex items-center space-x-1 shrink-0 bg-neutral-800/60 px-1.5 py-0.5 rounded-md border border-neutral-700/50">
                      <Headphones size={10} className={`text-purple-400 ${isAudioPlaying ? 'animate-bounce' : ''}`} />
                      <span className="text-[9px] font-bold text-neutral-300 tracking-wider">detikVoice</span>
                    </div>

                    {/* Timeline Progress Bar */}
                    <div 
                      className="flex-grow h-1 bg-neutral-800 rounded-full relative overflow-hidden group cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newProgress = (clickX / rect.width) * 100;
                        setAudioProgress(newProgress);
                      }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>

                    {/* Sound Wave Animation Visualizer */}
                    <div className="flex items-end space-x-0.5 h-2.5 px-0.5 shrink-0">
                      <span className={`w-0.5 bg-purple-500 rounded-full transition-all duration-150 ${isAudioPlaying ? 'animate-[pulse_0.6s_infinite_alternate]' : 'h-0.5'}`} style={{ height: isAudioPlaying ? '10px' : '2px' }} />
                      <span className={`w-0.5 bg-purple-400 rounded-full transition-all duration-150 ${isAudioPlaying ? 'animate-[pulse_0.4s_infinite_alternate_0.15s]' : 'h-1'}`} style={{ height: isAudioPlaying ? '7px' : '2px' }} />
                      <span className={`w-0.5 bg-purple-500 rounded-full transition-all duration-150 ${isAudioPlaying ? 'animate-[pulse_0.5s_infinite_alternate_0.3s]' : 'h-1'}`} style={{ height: isAudioPlaying ? '9px' : '2px' }} />
                    </div>

                    {/* Speed Multiplier Pill */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        cycleSpeed();
                      }}
                      type="button"
                      className="px-1.5 py-0.5 rounded-md bg-neutral-800 border border-neutral-700 hover:bg-neutral-750 text-[9px] font-bold text-neutral-200 tracking-wider transition-all select-none shrink-0 cursor-pointer focus:outline-none"
                      title="Atur Kecepatan Suara"
                    >
                      {audioSpeed.toFixed(2)}x
                    </button>
                  </div>

                  {/* Form inquiry for fast typed AI questions */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (suggestionQuery.trim() && onSearchAi) {
                        onSearchAi(suggestionQuery.trim());
                        setSuggestionQuery('');
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-2 bg-neutral-950/95 backdrop-blur-md p-1 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.6)] focus-within:shadow-[0_0_25px_rgba(168,85,247,0.15)] group"
                  >
                    <div className="flex items-center pl-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
                    </div>
                    <input 
                      type="text"
                      value={suggestionQuery}
                      onChange={(e) => setSuggestionQuery(e.target.value)}
                      placeholder="Tanya detikAI tentang berita ini..."
                      className="flex-grow bg-transparent text-white text-[11px] px-0.5 py-0.5 focus:outline-none placeholder-neutral-400 font-sans font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!suggestionQuery.trim()}
                      className="bg-purple-600 hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] disabled:opacity-30 disabled:hover:bg-purple-600 disabled:hover:shadow-none text-white p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md h-7 w-7 transform active:scale-95"
                      title="Tanya AI"
                    >
                      <Sparkles size={11} className="fill-white/10 animate-pulse text-purple-100" />
                    </button>
                  </form>

                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
