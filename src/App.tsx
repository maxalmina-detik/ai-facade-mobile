import React, { useState, useEffect } from 'react';
import { 
  INITIAL_REELS, 
  INITIAL_ARTICLES, 
  OTHER_TRENDING_NEWS, 
  BREAKING_NEWS_TICKER 
} from './data';
import { Article, Reel, Comment } from './types';
import ReelViewer from './components/ReelViewer';
import ArticleReader from './components/ArticleReader';
import AICompanion from './components/AICompanion';
import MilidetikTab from './components/MilidetikTab';
import { 
  BookOpen, 
  User, 
  Home, 
  Search, 
  Sparkles, 
  Grid, 
  Play, 
  PlayCircle, 
  Eye, 
  ThumbsUp, 
  MessageSquare, 
  ArrowUpRight, 
  ChevronRight, 
  TrendingUp, 
  X,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Mobile frame container vs fluid full screen state
  const [deviceFrameMode, setDeviceFrameMode] = useState(false);

  // Bottom Navigation state
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'explore' | 'milidetik' | 'category' | 'video'>('home');
  
  // Category Tab state (Terupdate, Rekomendasi, Populer, Lifestyle)
  const [currentCategoryTab, setCurrentCategoryTab] = useState<'Terupdate' | 'Rekomendasi' | 'Populer' | 'Lifestyle'>('Terupdate');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // AI mode clean state
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // Active story reels viewer ID
  const [activeReelId, setActiveReelId] = useState<string | null>(null);

  // Active reading article ID (null means index list)
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // User Profile dialog
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Category Drawer Menu
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Live state for articles to allow interactive additions (comments/likes)
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('detikcom_articles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ARTICLES; }
    }
    return INITIAL_ARTICLES;
  });

  // Hot ticker state
  const [dismissedBreaking, setDismissedBreaking] = useState(false);
  const [breakingModalOpen, setBreakingModalOpen] = useState(false);

  // Save changes locally
  useEffect(() => {
    localStorage.setItem('detikcom_articles', JSON.stringify(articles));
  }, [articles]);

  const handleAddComment = (articleId: string, newComment: Comment) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        return {
          ...art,
          comments: [newComment, ...art.comments]
        };
      }
      return art;
    }));
  };

  const handleLikeArticle = (articleId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        return {
          ...art,
          likes: art.likes + 1
        };
      }
      return art;
    }));
  };

  // Switch Category Tab or Navigation
  const handleNavSelect = (nav: 'home' | 'explore' | 'milidetik' | 'category' | 'video') => {
    setActiveBottomNav(nav);
    setActiveArticleId(null); // Return to list view
  };

  // Filter News according to category tabs and search inputs
  const getFilteredArticles = () => {
    let list = articles;

    if (activeBottomNav === 'video') {
      return list.filter(art => art.category.toLowerCase().includes('pagi') || art.id === 'art-4');
    }

    if (activeBottomNav === 'explore' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return [...list, ...OTHER_TRENDING_NEWS].filter(art => 
        art.title.toLowerCase().includes(query) || 
        art.category.toLowerCase().includes(query) || 
        art.content.some(p => p.toLowerCase().includes(query))
      );
    }

    // Standard Category Filtering
    if (currentCategoryTab === 'Rekomendasi') {
      // Show articles with higher read count
      return list.filter(art => art.readsCount > 15000);
    } else if (currentCategoryTab === 'Populer') {
      // Sort list by reads count
      return [...list].sort((a, b) => b.readsCount - a.readsCount);
    } else if (currentCategoryTab === 'Lifestyle') {
      // Filter specific category matches
      return list.filter(art => art.category.toLowerCase() === 'lifestyle' || art.id === 'art-4');
    }

    // "Terupdate" displays default Chrono items
    return list;
  };

  // Helper for single active article reader
  const currentOpenArticle = articles.find(art => art.id === activeArticleId) || 
                          OTHER_TRENDING_NEWS.find(art => art.id === activeArticleId);

  return (
    <div className={`min-h-screen bg-stone-100/50 flex flex-col justify-between selection:bg-[#ff4f00] selection:text-white ${
      deviceFrameMode ? 'items-center py-6' : ''
    }`}>

      {/* Frame Toggler for mock Smartphone screen feel */}
      <div className="hidden md:flex justify-center mb-2 shrink-0 select-none">
        <button 
          onClick={() => setDeviceFrameMode(!deviceFrameMode)}
          className="flex items-center space-x-1.5 bg-white border border-neutral-200 hover:border-neutral-300 rounded-full py-1 px-3 text-[10px] font-bold text-neutral-600 transition-all cursor-pointer shadow-sm"
        >
          <Smartphone size={12} className={deviceFrameMode ? 'text-purple-600' : ''} />
          <span>{deviceFrameMode ? 'Buka Skala Lebar (Desktop)' : 'Fokus Frame Mobile'}</span>
        </button>
      </div>

      <div className={`w-full flex flex-col justify-between bg-white text-[#1b1b1d] shadow-xl transition-all duration-300 relative ${
        deviceFrameMode 
          ? 'max-w-[430px] h-[884px] rounded-3xl border-[8px] border-neutral-900 overflow-hidden' 
          : 'min-h-screen'
      } ${activeBottomNav === 'milidetik' && !deviceFrameMode ? 'h-screen overflow-hidden' : ''}`}>

        <div className={`flex-grow flex flex-col min-h-0 relative ${
          deviceFrameMode 
            ? activeBottomNav === 'milidetik' 
              ? 'h-full overflow-hidden pb-16' 
              : 'overflow-y-auto no-scrollbar pb-24' 
            : activeBottomNav === 'milidetik' 
              ? 'h-full overflow-hidden pb-16' 
              : ''
        }`}>

          {/* ======================= DETIK APP HEADER & MULTI-NAVBAR (Sticky joint container) ======================= */}
          <div className="sticky top-0 z-40 bg-white border-b border-stone-100 select-none bg-opacity-95 backdrop-blur-sm">
            {/* TopAppBar */}
            <header className="bg-white text-primary text-headline-lg-mobile font-extrabold flex justify-between items-center w-full px-4 py-3">
              <button 
                onClick={() => setIsCategoryDrawerOpen(true)}
                aria-label="Menu" 
                className="text-neutral-800 hover:bg-neutral-50 p-2 rounded-full transition-colors opacity-80 cursor-pointer"
              >
                <BookOpen size={24} />
              </button>

              {/* detikcom Brand Trademark Identity */}
              <div 
                onClick={() => { setActiveArticleId(null); setActiveBottomNav('home'); }}
                className="flex items-center justify-center cursor-pointer hover:scale-102 transition-transform"
              >
                <span className="text-[#1a4d98] font-headline font-extrabold text-[26px] tracking-tighter leading-none">
                  detik<span className="text-[#ff4f00]">com</span>
                </span>
              </div>

              <button 
                onClick={() => setIsUserProfileOpen(true)}
                aria-label="Profile" 
                className="text-neutral-500 hover:bg-neutral-50 p-2 rounded-full transition-colors opacity-80 cursor-pointer"
              >
                <User size={24} className="text-neutral-400" />
              </button>
            </header>

            {/* ======================= TABS CATEGORIES (Joint sticky sub-nav, no complex offsets) ======================= */}
            {activeBottomNav === 'home' && !activeArticleId && (
              <nav className="bg-white border-t border-neutral-100 flex space-x-6 px-4 py-2.5 overflow-x-auto whitespace-nowrap no-scrollbar select-none shadow-[0_1px_3px_rgba(0,0,0,0.01)] items-center justify-start">
                {(['Terupdate', 'Rekomendasi', 'Populer', 'Lifestyle'] as const).map((tab) => {
                  const isActive = currentCategoryTab === tab;
                  return (
                    <button 
                      key={tab}
                      onClick={() => setCurrentCategoryTab(tab)}
                      className={`font-headline text-[13px] font-extrabold pb-1.5 px-0.5 border-b-2 transition-all cursor-pointer ${
                        isActive 
                          ? 'text-[#1a4d98] border-[#1a4d98]' 
                          : 'text-neutral-400 border-transparent hover:text-[#1a4d98]'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* ======================= MAIN WORKSPACE LAYOUT ======================= */}
          <main className={`flex-grow ${activeBottomNav === 'milidetik' ? 'flex flex-col min-h-0' : ''}`}>
            
            {/* If there is an active article open for details reading view */}
            {activeArticleId && currentOpenArticle ? (
              <ArticleReader 
                article={currentOpenArticle}
                onBack={() => setActiveArticleId(null)}
                onAddComment={handleAddComment}
                onLikeArticle={handleLikeArticle}
              />
            ) : (
              <>
                {/* 1. HOME TAB INTERFACE */}
                {activeBottomNav === 'home' && (
                  <div>
                    
                    {/* Story / Reels Section Container */}
                    <section className="mt-4 px-4 select-none">
                      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-3">
                        
                        {/* Reel Card Item 1 (Lamine Yamal) */}
                        <div 
                          onClick={() => setActiveReelId('reel-1')}
                          className="flex-none w-28 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-md hover:scale-[1.02] transition-all border border-neutral-100"
                        >
                          <img 
                            alt="Lamine Yamal Siap Tampil" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            src={INITIAL_REELS[0].imageUrl}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75"></div>
                          <div className="absolute top-2 right-2">
                            <PlayCircle size={15} className="text-white drop-shadow-md brightness-110" />
                          </div>
                          <div className="absolute top-2 left-2 right-6">
                            <p className="text-white font-headline text-[10px] leading-tight font-extrabold bg-black/50 p-1.5 rounded-sm border-l-2 border-red-600 line-clamp-3">
                              Lamine Yamal Siap Tampil di Piala Dunia...
                            </p>
                          </div>
                        </div>

                        {/* Reel Card Item 2 (Tim Cook) */}
                        <div 
                          onClick={() => setActiveReelId('reel-2')}
                          className="flex-none w-28 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-md hover:scale-[1.02] transition-all border border-neutral-100"
                        >
                          <img 
                            alt="Tim Cook Memo" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            src={INITIAL_REELS[1].imageUrl}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
                          <div className="absolute top-2 right-2">
                            <PlayCircle size={15} className="text-white drop-shadow-md brightness-110" />
                          </div>
                          <div className="absolute bottom-3 left-2 right-2">
                            <p className="text-neutral-900 font-headline text-[9px] leading-tight font-extrabold bg-white/95 p-1 rounded-sm border-l-2 border-[#ff4f00] line-clamp-3 text-center">
                              Pidato Perpisahan Tim Cook Sebagai CEO...
                            </p>
                          </div>
                        </div>

                        {/* Reel Card Item 3 (Nikita Willy) */}
                        <div 
                          onClick={() => setActiveReelId('reel-3')}
                          className="flex-none w-28 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-md hover:scale-[1.02] transition-all border border-neutral-100"
                        >
                          <img 
                            alt="Nikita Willy AI" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            src={INITIAL_REELS[2].imageUrl}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/75"></div>
                          <div className="absolute top-2 right-2">
                            <PlayCircle size={15} className="text-white drop-shadow-md brightness-110" />
                          </div>
                          <div className="absolute bottom-3 left-2 right-2 text-center decoration-clone">
                            <p className="text-[#ff4f00] font-headline text-[9px] font-extrabold text-shadow-md uppercase tracking-tight leading-none scale-95">
                              MOMEN NIKITA WILLY CEK KULIT PAKAI AI HASILNYA BIKIN SYOK!
                            </p>
                          </div>
                        </div>

                        {/* Reel Card Item 4 (Briefing situational - Crop view placeholder) */}
                        <div 
                          onClick={() => setActiveReelId('reel-4')}
                          className="flex-none w-16 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-md hover:scale-[1.02] transition-all opacity-85 hover:opacity-100 border border-neutral-100"
                        >
                          <img 
                            alt="Briefing" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            src={INITIAL_REELS[3].imageUrl}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60"></div>
                        </div>

                      </div>
                    </section>

                    {/* Featured Article Card */}
                    <section className="px-4 mt-2 mb-6">
                      <article 
                        onClick={() => setActiveArticleId('art-1')}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col group cursor-pointer hover:shadow-md transition-all duration-300"
                      >
                        <div className="relative w-full aspect-[16/10] overflow-hidden">
                          <img 
                            alt="Feature Cover" 
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                            src={articles[0].imageUrl}
                          />
                          {/* Breaking news badge over feature */}
                          {articles[0].breaking && (
                            <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase py-1 px-2.5 rounded shadow">
                              BREAKING TOP NEWS
                            </span>
                          )}
                        </div>

                        {/* Text segment of featured card */}
                        <div className="bg-[#003e6f] p-4 text-white flex-grow hover:bg-[#044c85] transition-colors duration-200">
                          <span className="font-headline font-extrabold text-[#ff4f00] text-[10px] uppercase tracking-widest block mb-1">
                            {articles[0].category}
                          </span>
                          <h2 className="font-headline text-base md:text-lg font-extrabold leading-snug mb-2 line-clamp-3">
                            {articles[0].title}
                          </h2>
                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 text-[10px] opacity-80">
                            <span>Oleh: {articles[0].author}</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded">{articles[0].readsCount.toLocaleString('id-ID')} views</span>
                          </div>
                        </div>
                      </article>
                    </section>

                    {/* Standard List Grid feed */}
                    <section className="px-4 space-y-4 mb-24">
                      <div className="flex items-center justify-between pb-1 border-b border-stone-100 mb-3 select-none">
                        <span className="text-[11px] font-black uppercase text-[#1a4d98] tracking-widest">Kanal Berita Terkini</span>
                        <span className="text-[10px] text-neutral-400 font-mono">Total {getFilteredArticles().length} artikel</span>
                      </div>

                      {getFilteredArticles().map((art) => {
                        // Skip art-1 if it was already displayed as the lead featured article
                        if (art.id === 'art-1' && currentCategoryTab === 'Terupdate') return null;

                        return (
                          <article 
                            onClick={() => setActiveArticleId(art.id)}
                            key={art.id}
                            className="flex space-x-3.5 py-3 border-b border-stone-50 last:border-0 group cursor-pointer hover:bg-neutral-50/50 rounded-xl px-1.5 transition-colors"
                          >
                            <div className="flex-grow flex flex-col justify-between">
                              <div>
                                <span className="font-headline font-extrabold text-[10px] text-[#ff4f00] uppercase tracking-widest mb-1.5 block">
                                  {art.category}
                                </span>
                                <h3 className="font-headline text-xs md:text-sm font-extrabold leading-snug text-neutral-800 group-hover:text-[#1a4d98] transition-colors line-clamp-3">
                                  {art.title}
                                </h3>
                              </div>
                              <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-2 font-mono">
                                <span>{art.author}</span>
                                <span>•</span>
                                <span>{art.comments.length} komentar</span>
                              </div>
                            </div>

                            <div className="flex-none w-24 h-24 rounded-xl overflow-hidden border border-neutral-100 relative">
                              <img 
                                alt={art.imageAlt} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                src={art.imageUrl}
                              />
                            </div>
                          </article>
                        );
                      })}
                    </section>
                  </div>
                )}

                {/* 2. EXPLORE SEARCH TAB INTERFACE */}
                {activeBottomNav === 'explore' && (
                  <div className="p-4 mb-24">
                    <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-sm mb-6 select-none">
                      <h2 className="font-headline font-extrabold text-sm uppercase text-neutral-800 tracking-wide mb-1">
                        Eksplorasi Detik ID
                      </h2>
                      <p className="text-[10px] text-neutral-400">Temukan berita terkini global terakurat secara langsung.</p>
                      
                      <div className="relative mt-4">
                        <Search className="absolute left-3.5 top-3 text-neutral-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Cari topik hangat (BPJS, Apple, Lamine, dll)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-neutral-50 rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#1a4d98] text-neutral-800 placeholder-neutral-400 border border-neutral-200"
                        />
                      </div>
                    </div>

                    {/* Search Results / Trending switch container */}
                    {searchQuery.trim() ? (
                      <div className="space-y-4">
                        <span className="text-[10px] uppercase font-black tracking-wider text-neutral-400 block mb-2 select-none">
                          Hasil Pencarian untuk "{searchQuery}"
                        </span>
                        {getFilteredArticles().length === 0 ? (
                          <p className="text-xs text-neutral-400 text-center py-10">Tidak menemukan berita yang cocok.</p>
                        ) : (
                          getFilteredArticles().map(art => (
                            <div 
                              onClick={() => setActiveArticleId(art.id)}
                              key={art.id}
                              className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all flex space-x-3 cursor-pointer group"
                            >
                              <div className="flex-grow">
                                <span className="text-[9px] font-bold text-[#ff4f00] uppercase block mb-1">{art.category}</span>
                                <h4 className="font-headline font-bold text-xs text-neutral-800 line-clamp-2 leading-snug group-hover:text-[#1a4d98] transition-colors">{art.title}</h4>
                              </div>
                              <img src={art.imageUrl} className="w-14 h-14 rounded-lg object-cover shrink-0 border" alt={art.imageAlt} />
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Static Trending terms triggers */}
                        <div className="select-none">
                          <span className="text-[10px] uppercase font-black tracking-widest text-[#1a4d98] block mb-2">Trend Cepat</span>
                          <div className="flex gap-2 flex-wrap">
                            {['BPJS Kesehatan', 'Tim Cook memo', 'Lamine Yamal', 'JPO Lenteng Agung', 'AI Skincare'].map((term) => (
                              <button 
                                onClick={() => setSearchQuery(term)}
                                key={term}
                                className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 py-1.5 px-3 rounded-full text-xs font-bold text-neutral-600 cursor-pointer"
                              >
                                #{term}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Top Read Trending collection from separate lists */}
                        <div>
                          <span className="text-[10px] uppercase font-black tracking-widest text-[#1a4d98] block mb-3 select-none">Berita Terpopuler Minggu Ini</span>
                          <div className="space-y-3">
                            {OTHER_TRENDING_NEWS.map((trend, i) => (
                              <div 
                                onClick={() => setActiveArticleId(trend.id)}
                                key={trend.id}
                                className="flex items-center space-x-4 cursor-pointer hover:bg-neutral-50 p-2 rounded-xl"
                              >
                                <span className="font-headline font-black text-xl text-neutral-300">0{i+1}</span>
                                <div className="flex-grow">
                                  <span className="text-[9px] font-bold text-[#ff4f00] uppercase">{trend.category}</span>
                                  <h4 className="font-headline font-bold text-[13px] text-neutral-800 leading-tight line-clamp-2">{trend.title}</h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. MILIDETIK VERTICAL EXPERIENCE PRODUCT */}
                {activeBottomNav === 'milidetik' && (
                  <div className="w-full h-full flex-grow">
                    <MilidetikTab onReadArticle={(id) => {
                      setActiveArticleId(id);
                      setActiveBottomNav('home');
                    }} />
                  </div>
                )}

                {/* 4. CHANNELS CATEGORIES INDEX LIST */}
                {activeBottomNav === 'category' && (
                  <div className="p-4 mb-24 select-none">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#1a4d98] block mb-4">Daftar Kanal Berita Resmi</span>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { title: 'detikNews', desc: 'Fakta Politik & Hukum', color: 'bg-blue-50 text-blue-700' },
                        { title: 'detikSport', desc: 'Arena Sepakbola Terhangat', color: 'bg-green-50 text-green-700' },
                        { title: 'detikInet', desc: 'Gizmos & Analisis Tekno', color: 'bg-purple-50 text-purple-700' },
                        { title: 'detikFinance', desc: 'Kurs Makro & Pasar Saham', color: 'bg-amber-50 text-amber-700' },
                        { title: 'Detik Pagi', desc: 'Sorotan Kabar Pagi', color: 'bg-red-50 text-red-700' },
                        { title: 'Lifestyle', desc: 'Tren Kecantikan & Gaya', color: 'bg-rose-50 text-rose-700' }
                      ].map((ch) => (
                        <div 
                          onClick={() => {
                            setSearchQuery(ch.title);
                            setActiveBottomNav('explore');
                          }}
                          key={ch.title}
                          className={`p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all text-left ${ch.color} border-neutral-100/50`}
                        >
                          <h4 className="font-headline font-extrabold text-sm">{ch.title}</h4>
                          <p className="text-[10px] opacity-80 mt-1 leading-tight">{ch.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. VIDEO PORTAL */}
                {activeBottomNav === 'video' && (
                  <div className="p-4 mb-24">
                    <div className="bg-black/90 p-4 rounded-xl text-white mb-6 select-none shadow">
                      <span className="text-[9px] bg-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">detikFlash Video</span>
                      <h3 className="font-headline font-bold text-sm mt-2 leading-snug">Saksikan liputan jurnalisme visual eksklusif berkualitas tinggi secara langsung.</h3>
                    </div>

                    <div className="space-y-4">
                      {INITIAL_ARTICLES.map((vid) => (
                        <div 
                          onClick={() => setActiveArticleId(vid.id)}
                          key={vid.id}
                          className="bg-white rounded-xl overflow-hidden border border-neutral-200 cursor-pointer hover:shadow"
                        >
                          <div className="relative aspect-video bg-neutral-100">
                            <img src={vid.imageUrl} className="w-full h-full object-cover" alt={vid.title} />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <span className="p-3 bg-[#1a4d98] rounded-full text-white shadow"><Play size={20} fill="white" /></span>
                            </div>
                          </div>
                          <div className="p-3 text-left">
                            <span className="text-[9px] font-bold text-purple-600 block mb-0.5">{vid.category} VIDEO</span>
                            <h4 className="font-headline font-extrabold text-xs text-neutral-800 line-clamp-2 leading-tight">{vid.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </>
            )}

          </main>

        </div>

        {/* ======================= CHAT COMPANION DIALOG PORTAL (Removed floating absolute overlay) ======================= */}

        {/* ======================= REEL FULL STORY EXPERIENCES ======================= */}
        {activeReelId && (
          <ReelViewer 
            reels={INITIAL_REELS}
            initialReelId={activeReelId}
            onClose={() => setActiveReelId(null)}
          />
        )}

        {/* ======================= PREMIUM SHORTCUT FLOATING KEY (detikAI launcher) ======================= */}
        {!isAiChatOpen && (
          <button 
            onClick={() => {
              setIsAiChatOpen(true);
            }}
            aria-label="Tanya detikAI"
            className="fixed md:absolute bottom-20 right-4 w-14 h-14 bg-gradient-to-tr from-[#1a4d98] via-[#003e6f] to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 active:scale-95 group transition-transform active:rotate-3 select-none cursor-pointer"
          >
            <span className="font-headline font-black text-lg tracking-tight font-extrabold text-white">AI</span>
            {/* Pulsing visual outline */}
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-25" />
            <div className="absolute inset-0 rounded-full border border-white/10" />
            {/* Micro Sparkle */}
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-neutral-900 rounded-full p-0.5 shadow-sm text-[8px] font-extrabold scale-90 border border-white/10 flex items-center justify-center w-5 h-5 leading-none">
              ✨
            </div>
          </button>
        )}

        {/* ======================= FULLSCREEN DETIKAI COMPANION PANEL ======================= */}
        {isAiChatOpen && (
          <>
            {/* Dark blurred backdrop on desktop screen */}
            {!deviceFrameMode && (
              <div 
                onClick={() => setIsAiChatOpen(false)}
                className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 cursor-pointer hidden md:block" 
              />
            )}
            <div className={`z-50 flex flex-col justify-between overflow-hidden ${
              deviceFrameMode 
                ? 'absolute inset-0 bg-white rounded-2xl' 
                : 'fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[460px] md:h-[720px] bg-white md:rounded-3xl md:shadow-2xl md:border md:border-stone-150'
            }`}>
              <AICompanion onBackToHome={() => setIsAiChatOpen(false)} embedMode={true} />
            </div>
          </>
        )}

        {/* ======================= FLOATING BREAKING NEWS TICKER ======================= */}
        {!dismissedBreaking && !activeArticleId && activeBottomNav !== 'milidetik' && (
          <div className="fixed md:absolute bottom-16 left-0 right-0 px-4 py-2 flex justify-start z-30 pointer-events-none select-none">
            <div className="bg-red-600 text-white rounded-full pl-3 pr-4 py-1.5 flex items-center space-x-2 shadow-lg pointer-events-auto cursor-pointer border border-red-500 hover:scale-[1.01] transition-transform">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse border border-red-600"></span>
              <span 
                onClick={() => setBreakingModalOpen(true)}
                className="font-headline font-black text-[10px] uppercase. uppercase tracking-wider text-white"
              >
                Breaking News
              </span>
            </div>

            <button 
              onClick={() => setDismissedBreaking(true)}
              className="bg-[#1a4d98] hover:bg-[#12386e] text-white rounded-full w-8 h-8 ml-2 flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ======================= BOTTOM MOBILE NAVIGATION DOCK ======================= */}
        <nav className={`bg-white text-neutral-400 border-t border-neutral-100 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] ${
          deviceFrameMode ? 'absolute' : 'fixed'
        } bottom-0 left-0 right-0 w-full flex justify-around items-center px-1 py-1.5 pb-safe z-40 select-none`}>
          
          <button 
            onClick={() => handleNavSelect('home')}
            className={`flex flex-col items-center p-1.5 rounded-lg transition-colors w-15 cursor-pointer ${
              activeBottomNav === 'home' ? 'text-[#1a4d98] font-bold scale-102' : 'hover:bg-neutral-50/50'
            }`}
          >
            <Home size={18} className={activeBottomNav === 'home' ? 'fill-current' : ''} />
            <span className="text-[10px] mt-0.5 truncate text-center w-full">Home</span>
          </button>

          <button 
            onClick={() => handleNavSelect('explore')}
            className={`flex flex-col items-center p-1.5 rounded-lg transition-colors w-15 cursor-pointer ${
              activeBottomNav === 'explore' ? 'text-[#1a4d98] font-bold scale-102' : 'hover:bg-neutral-50/50'
            }`}
          >
            <Search size={18} className={activeBottomNav === 'explore' ? 'stroke-3' : ''} />
            <span className="text-[10px] mt-0.5 truncate text-center w-full">Explore</span>
          </button>

          <button 
            onClick={() => handleNavSelect('milidetik')}
            className={`flex flex-col items-center p-1.5 rounded-lg transition-colors w-15 relative cursor-pointer ${
              activeBottomNav === 'milidetik' ? 'text-purple-600 font-bold scale-102' : 'hover:bg-neutral-50/50'
            }`}
          >
            <Sparkles size={18} className={activeBottomNav === 'milidetik' ? 'text-purple-600 fill-purple-100 animate-pulse' : 'text-purple-500'} />
            <span className="text-[10px] mt-0.5 truncate text-center w-full">Milidetik</span>
          </button>

          <button 
            onClick={() => handleNavSelect('category')}
            className={`flex flex-col items-center p-1.5 rounded-lg transition-colors w-15 cursor-pointer ${
              activeBottomNav === 'category' ? 'text-[#1a4d98] font-bold scale-102' : 'hover:bg-neutral-50/50'
            }`}
          >
            <Grid size={18} />
            <span className="text-[10px] mt-0.5 truncate text-center w-full">Category</span>
          </button>

          <button 
            onClick={() => handleNavSelect('video')}
            className={`flex flex-col items-center p-1.5 rounded-lg transition-colors w-15 cursor-pointer ${
              activeBottomNav === 'video' ? 'text-[#1a4d98] font-bold scale-102' : 'hover:bg-neutral-50/50'
            }`}
          >
            <PlayCircle size={18} />
            <span className="text-[10px] mt-0.5 truncate text-center w-full">Video</span>
          </button>

        </nav>

        {/* ======================= USER PROFILE POPUP MODAL ======================= */}
        {isUserProfileOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 border border-neutral-100 shadow-xl text-center relative">
              <button 
                onClick={() => setIsUserProfileOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>
              
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3.5 border shadow-inner">
                <User size={36} />
              </div>
              
              <h3 className="font-headline font-extrabold text-[#003e6f] text-sm">Pembaca Setia (maxalmina)</h3>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">maxalmina@detik.com</p>
              
              <div className="border-t border-neutral-100 my-4 pt-4 text-left text-xs text-neutral-600 space-y-2.5">
                <div className="flex justify-between font-medium">
                  <span>Likes Tersimpan</span> <span>12 Artikel</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Komentar Dipublikasikan</span> <span>3 Opini</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Keanggotaan Pas</span> <span className="text-emerald-600 font-bold uppercase tracking-wider">Premium Reader</span>
                </div>
              </div>

              <button 
                onClick={() => setIsUserProfileOpen(false)}
                className="w-full bg-[#1a4d98] hover:bg-[#12386e] text-white font-bold py-2 rounded-lg text-xs transition-colors shrink-0 select-none cursor-pointer"
              >
                Tutup Profilku
              </button>
            </div>
          </div>
        )}

        {/* ======================= CHANNELS CATEGORIES SLIDE OUT DRAWER ======================= */}
        {isCategoryDrawerOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 select-none">
            <div className="bg-white w-[280px] h-full p-5 flex flex-col justify-between border-r shadow-2.5xl relative">
              <button 
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex-grow">
                <div className="flex items-center space-x-1 mb-6 mt-2">
                  <span className="text-[#1a4d98] font-headline font-extrabold text-lg tracking-tighter">detik</span>
                  <span className="text-[#ff4f00] font-headline font-extrabold text-lg tracking-tighter">com Menu</span>
                </div>

                <div className="space-y-4 text-xs font-bold text-neutral-600">
                  <section>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#1a4d98] block mb-2">Kanal Utama</span>
                    <ul className="space-y-1.5 text-left">
                      {['detikNews', 'detikSport', 'detikInet', 'detikFinance', 'Detik Pagi', 'Lifestyle'].map(channel => (
                        <li 
                          key={channel}
                          onClick={() => {
                            setSearchQuery(channel);
                            setActiveBottomNav('explore');
                            setIsCategoryDrawerOpen(false);
                          }}
                          className="hover:text-[#1a4d98] hover:bg-neutral-50 p-2 rounded-lg cursor-pointer transition-colors"
                        >
                          {channel}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 text-center">
                <p className="text-[10px] text-neutral-400">© 2026 detikcom. Seluruh hak cipta dilindungi undang-undang.</p>
              </div>

            </div>
          </div>
        )}

        {/* ======================= BREAKING NEWS DETAILED POPUP CARD ======================= */}
        {breakingModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 border border-red-200 shadow-xl relative text-left">
              <button 
                onClick={() => setBreakingModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center space-x-1.5 mb-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0" />
                <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded tracking-widest">
                  Live Flash Alert
                </span>
              </div>

              <h3 className="font-headline font-extrabold text-red-600 text-sm mb-3">
                {BREAKING_NEWS_TICKER.title}
              </h3>
              
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                BNPB menginformasikan bahwa gempa berkekuatan Magnitudo 5.2 baru saja melanda kawasan Malang, Jawa Timur pukul 11:42 WIB. Pusat gempa terdeteksi berada di laut sedalam 10 kilometer.
              </p>

              <button 
                onClick={() => setBreakingModalOpen(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-xs transition-colors shrink-0 select-none cursor-pointer text-center"
              >
                Konfirmasi • Mengerti
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
