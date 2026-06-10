import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { ArrowLeft, User, Calendar, Flame, Eye, ThumbsUp, MessageCircle, Heart, Share2, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onAddComment: (articleId: string, newComment: Comment) => void;
  onLikeArticle: (articleId: string) => void;
}

export default function ArticleReader({ article, onBack, onAddComment, onLikeArticle }: ArticleReaderProps) {
  const [commentText, setCommentText] = useState('');
  const [newsQuery, setNewsQuery] = useState('');
  const [newsAnswer, setNewsAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  // AI Automatic Summarization
  const [aiSummary, setAiSummary] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(true);

  // Local Reaction State
  const [readerReactions, setReaderReactions] = useState({
    claps: Math.floor(article.likes / 3),
    surprised: Math.floor(article.likes / 5),
    angry: Math.floor(article.readsCount / 1000)
  });

  const [hasLiked, setHasLiked] = useState(false);

  // Fetch AI Summary on load
  useEffect(() => {
    let active = true;
    setIsSummarizing(true);
    setAiSummary([]);
    setNewsAnswer('');
    setNewsQuery('');

    async function fetchSummary() {
      try {
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: article.title,
            content: article.content
          })
        });
        const data = await res.json();
        if (active) {
          setAiSummary(data.summary || []);
        }
      } catch (err) {
        if (active) {
          setAiSummary([
            'Terjadi kesalahan teknis saat menghubungi sistem rangkuman AI.',
            'Coba periksa file konfigurasi atau kunci API Anda.',
            'Semua data artikel lengkap dapat diakses secara manual di bawah.'
          ]);
        }
      } finally {
        if (active) {
          setIsSummarizing(false);
        }
      }
    }

    fetchSummary();

    return () => {
      active = false;
    };
  }, [article.id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userName: 'Pembaca Setia (Anda)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
      content: commentText.trim(),
      createdAt: 'Baru saja'
    };

    onAddComment(article.id, newComment);
    setCommentText('');
  };

  const askDetikAIAboutArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsQuery.trim()) return;

    setIsAsking(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ id: '1', sender: 'user', text: newsQuery }],
          articleTitle: article.title,
          articleContent: article.content.join('\n')
        })
      });
      const data = await res.json();
      setNewsAnswer(data.text);
    } catch (err) {
      setNewsAnswer('Koneksi terputus. Gagal menghasilkan respon dari detikAI.');
    } finally {
      setIsAsking(false);
    }
  };

  const handleThumbReaction = () => {
    if (!hasLiked) {
      onLikeArticle(article.id);
      setHasLiked(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Back to feed header */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-1 border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 px-3 py-1.5 rounded-full text-xs text-neutral-600 transition-colors mb-6 cursor-pointer select-none"
      >
        <ArrowLeft size={14} />
        <span className="font-bold">Kembali ke Beranda Berita</span>
      </button>

      {/* Article Categories & Meta */}
      <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-3 uppercase tracking-wider font-bold">
        <span className="text-[#1a4d98]">{article.category}</span>
        <span>•</span>
        <span>{article.subCategory || "Terhangat"}</span>
      </div>

      <h1 className="font-headline text-2xl md:text-3xl font-extrabold text-neutral-900 leading-tight mb-4 tracking-tight">
        {article.title}
      </h1>

      {/* Authors and Timestamps */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-3.5 mb-6 text-xs text-neutral-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="p-1 bg-neutral-100 rounded-full text-neutral-500"><User size={13} /></span>
            <span>Oleh: <strong className="text-neutral-900">{article.author}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="p-1 bg-neutral-100 rounded-full text-neutral-500"><Calendar size={13} /></span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-neutral-500">
          <div className="flex items-center space-x-1">
            <Eye size={14} className="text-neutral-400" />
            <span>{article.readsCount.toLocaleString('id-ID')} dibaca</span>
          </div>
          <p className="bg-red-50 text-red-600 font-bold px-2 py-0.5 rounded text-[10px]">LIVE UPDATES</p>
        </div>
      </div>

      {/* Display Cover Image */}
      <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6 shadow-sm border border-neutral-200">
        <img 
          src={article.imageUrl} 
          alt={article.imageAlt} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* DUAL COLS: Left Content / Right AI Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left main content col */}
        <div className="lg:col-span-8 flex flex-col space-y-5 text-neutral-800 text-sm md:text-base leading-relaxed">
          
          {/* Smart AI Summary Block */}
          <div className="bg-[#f0edef]/60 rounded-xl p-4 md:p-5 border border-purple-200/50 my-2">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles size={16} className="text-purple-600 fill-purple-100" />
              <h3 className="font-headline font-bold text-sm text-purple-950 uppercase tracking-wider">
                Rangkuman Berita detikAI (Terangkum Kilat)
              </h3>
            </div>

            {isSummarizing ? (
              <div className="space-y-2 py-2">
                <div className="h-3 bg-purple-100 rounded animate-pulse w-11/12" />
                <div className="h-3 bg-purple-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-purple-100 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <ul className="space-y-2">
                {aiSummary.map((item, index) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="flex items-start text-xs md:text-sm text-neutral-700 font-medium"
                  >
                    <span className="text-purple-600 mr-2 shrink-0 select-none font-bold">✔</span>
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          {/* Actual Article Paragraphs */}
          <div className="space-y-4">
            {article.content.map((p, idx) => (
              <p key={idx} className="text-neutral-800 leading-relaxed font-normal text-justify">
                {p}
              </p>
            ))}
          </div>

          {/* Social interact buttons */}
          <div className="border-t border-b border-neutral-200 py-4 my-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={handleThumbReaction}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold transition-all select-none ${
                  hasLiked 
                    ? 'bg-[#1a4d98] text-white border-[#1a4d98]' 
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <ThumbsUp size={14} />
                <span>Like ({article.likes + (hasLiked ? 1 : 0)})</span>
              </button>

              <button 
                onClick={() => setReaderReactions(prev => ({ ...prev, claps: prev.claps + 1 }))}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs text-neutral-700 select-none"
              >
                <span>👏 Clap</span>
                <span className="font-mono bg-neutral-100 px-1 py-0.2 rounded text-[10px]">{readerReactions.claps}</span>
              </button>

              <button 
                onClick={() => setReaderReactions(prev => ({ ...prev, surprised: prev.surprised + 1 }))}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-xs text-neutral-700 select-none"
              >
                <span>😲 Syok</span>
                <span className="font-mono bg-neutral-100 px-1 py-0.2 rounded text-[10px]">{readerReactions.surprised}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-neutral-500">
              <Share2 size={14} className="text-neutral-400" />
              <span>Bagikan Artikel</span>
            </div>
          </div>

          {/* Discussion Box & User Comment form */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle size={18} className="text-[#1a4d98]" />
              <h3 className="font-headline font-bold text-base text-neutral-950">
                Kolom Komentar ({article.comments.length})
              </h3>
            </div>

            <form onSubmit={handleSubmitComment} className="flex flex-col space-y-2 mb-6 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm">
              <textarea 
                placeholder="Tulis opini santun Anda mengenai artikel ini..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs md:text-sm text-neutral-800 focus:outline-none focus:border-[#1a4d98] placeholder-neutral-400 focus:ring-1 focus:ring-[#1a4d98]"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-neutral-400">Harap menjaga kesantunan berpendapat.</span>
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-[#1a4d98] hover:bg-[#12386e] text-white font-bold p-1.5 px-4 rounded-lg text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 select-none"
                >
                  <Send size={12} />
                  <span>Kirim</span>
                </button>
              </div>
            </form>

            {/* List comments */}
            <div className="space-y-4">
              {article.comments.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-4 bg-white rounded-xl border border-dashed border-neutral-200">
                  Belum ada komentar. Jadilah yang pertama memberikan tanggapan!
                </p>
              ) : (
                article.comments.map((cm) => (
                  <div key={cm.id} className="flex space-x-3 bg-white p-3.5 rounded-xl border border-neutral-200 shadow-sm">
                    <img 
                      src={cm.avatarUrl} 
                      alt={cm.userName} 
                      className="w-8 h-8 rounded-full object-cover text-xs bg-neutral-100"
                    />
                    <div className="flex-grow text-xs md:text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-neutral-900 font-headline font-bold">{cm.userName}</strong>
                        <span className="text-[10px] text-neutral-400 font-mono">{cm.createdAt}</span>
                      </div>
                      <p className="text-neutral-700 font-medium leading-relaxed">{cm.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right side contextual AI widgets */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ask detikAI specifically about this article content widget */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50/70 border border-purple-200/50 p-4 rounded-2xl shadow-sm sticky top-[130px]">
            <div className="flex items-center space-x-1.5 mb-3">
              <Sparkles size={16} className="text-purple-600 animate-pulse fill-purple-100" />
              <h4 className="font-headline font-extrabold text-xs uppercase tracking-wide text-purple-950">
                Tanya detikAI (Konteks Berita)
              </h4>
            </div>

            <p className="text-[11px] text-purple-900 leading-relaxed mb-4 font-medium">
              Butuh klarifikasi atau penasaran tentang tokoh/lokasi dalam berita ini? Ajukan pertanyaan bebas di bawah!
            </p>

            <form onSubmit={askDetikAIAboutArticle} className="space-y-2">
              <input 
                type="text" 
                placeholder="Siapa Pramono Anung?..."
                value={newsQuery}
                onChange={(e) => setNewsQuery(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-400 shadow-inner"
              />
              <button 
                type="submit"
                disabled={isAsking || !newsQuery.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center space-x-1 transition-all shadow-sm select-none"
              >
                {isAsking ? (
                  <span>Berpikir...</span>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>Analisis Kabar</span>
                  </>
                )}
              </button>
            </form>

            {/* Answer Display */}
            <AnimatePresence>
              {newsAnswer && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-white/90 border border-purple-100 p-3.5 rounded-xl text-xs text-neutral-800 text-left leading-relaxed shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2 pb-1 border-b border-purple-50 text-[10px] text-purple-600 font-extrabold uppercase">
                    <span>Analisis detikAI:</span>
                    <button 
                      onClick={() => setNewsAnswer('')}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      tutup
                    </button>
                  </div>
                  <p className="font-medium text-neutral-700 text-justify">{newsAnswer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
