import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  ChevronUp, 
  ChevronDown, 
  BookOpen, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MilidetikTabProps {
  onReadArticle?: (id: string) => void;
}

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

export default function MilidetikTab({ onReadArticle }: MilidetikTabProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  const activeCard = MILIDETIK_CARDS[activeIndex];

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
        
        {/* Dynamic stories slider indicator */}
        <div className="flex space-x-1 items-center bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
          {MILIDETIK_CARDS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === activeIndex 
                  ? 'w-4 bg-purple-400 shadow-sm shadow-purple-500' 
                  : idx < activeIndex 
                    ? 'w-1.5 bg-white/70' 
                    : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main card stage area with slide transitions */}
      <div className="flex-grow w-full h-full relative overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -150 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-end"
          >
            {/* Background Fullscreen Image with sharp crop */}
            <div className="absolute inset-0 w-full h-full bg-neutral-900 z-0">
              <img 
                src={activeCard.imageUrl} 
                alt={activeCard.imageAlt}
                className="w-full h-full object-cover scale-102 filter brightness-[0.75]"
                referrerPolicy="no-referrer"
              />
              {/* Complex heavy dark gradients for ultimate readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-black/40 z-10" />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-950/50 to-transparent z-10" />
            </div>

            {/* Content Foreground info box */}
            <div className="relative z-20 px-4 md:px-6 pb-20 md:pb-22 w-full max-w-xl mx-auto space-y-4 text-left">
              
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
              <h2 className="font-headline font-black text-base md:text-lg leading-snug text-neutral-50 tracking-tight glow-subtle">
                {activeCard.title}
              </h2>

              {/* MILIDETIK 3 HIGHLIGHT BULLET POINTS */}
              <div className="space-y-3 pt-2">
                {activeCard.bullets.map((bullet, bIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + bIdx * 0.1 }}
                    key={bIdx}
                    className="flex items-start space-x-2.5"
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-purple-500/20 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-300 font-mono text-[10px] font-bold mt-0.5 shadow-sm">
                      {bIdx + 1}
                    </div>
                    <p className="text-xs md:text-sm text-neutral-200 font-medium leading-relaxed leading-normal text-justify">
                      {bullet}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions and Read More linkage */}
              <div className="pt-4 flex items-center justify-between border-t border-white/5 gap-3">
                
                {/* Baca Selengkapnya action button linking directly to detail view */}
                {onReadArticle && (
                  <button 
                    onClick={() => onReadArticle(activeCard.articleId)}
                    type="button"
                    className="flex-grow bg-[#ff4f00] hover:bg-[#e04500] text-white py-2 px-4 rounded-xl text-xs font-black shadow-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer transform hover:scale-[1.02] active:scale-98 select-none"
                  >
                    <BookOpen size={13} />
                    <span>Baca Berita Lengkap</span>
                  </button>
                )}

                {/* Like Button */}
                <button 
                  onClick={() => toggleLikeCard(activeCard.id)}
                  type="button"
                  title="Sukai Berita"
                  className={`p-2.5 rounded-xl border transition-all flex items-center justify-center space-x-1 cursor-pointer select-none ${
                    likedMap[activeCard.id] 
                      ? 'bg-purple-600 border-purple-500 text-white scale-105' 
                      : 'bg-black/30 border-white/10 hover:border-white/20 text-neutral-300'
                  }`}
                >
                  <ThumbsUp size={13} className={likedMap[activeCard.id] ? 'fill-white' : ''} />
                  <span className="text-[10px] font-extrabold">
                    {activeCard.likesInitial + (likedMap[activeCard.id] ? 1 : 0)}
                  </span>
                </button>

                {/* Share Button with copied indicator */}
                <button 
                  onClick={() => handleShare(activeCard.title, activeCard.id)}
                  type="button"
                  title="Bagikan Ringkasan"
                  className="p-2.5 rounded-xl bg-black/30 border border-white/10 hover:border-white/20 text-neutral-300 transition-all flex items-center justify-center cursor-pointer select-none"
                >
                  {copiedMap[activeCard.id] ? (
                    <Check size={13} className="text-green-400" />
                  ) : (
                    <Share2 size={13} />
                  )}
                </button>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Up / Down navigation arrows Overlay (For Desktop / Non-touch laptop users) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-4 select-none">
          <button 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            aria-label="Kembali"
            className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white disabled:opacity-20 hover:bg-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer select-none flex items-center justify-center"
          >
            <ChevronUp size={18} />
          </button>
          
          <button 
            onClick={handleNext}
            disabled={activeIndex === MILIDETIK_CARDS.length - 1}
            aria-label="Lanjut"
            className="p-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white disabled:opacity-20 hover:bg-neutral-800/80 hover:border-neutral-700 transition-all cursor-pointer select-none flex items-center justify-center"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Touch indicator hint */}
        <div className="absolute bottom-16 left-0 right-0 z-30 flex justify-center pointer-events-none select-none">
          <div className="flex flex-col items-center animate-bounce opacity-40">
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Geser Naik / Turun</span>
            <ChevronDown size={10} className="text-neutral-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
