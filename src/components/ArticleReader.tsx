import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types';
import { ArrowLeft, User, Calendar, Flame, Eye, ThumbsUp, MessageCircle, Heart, Share2, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OTHER_TRENDING_NEWS, ARTICLE_SUGGESTIONS_MAP } from '../data';

interface ArticleReaderProps {
  article: Article;
  onBack: () => void;
  onAddComment: (articleId: string, newComment: Comment) => void;
  onLikeArticle: (articleId: string) => void;
  onSearchAi?: (query: string) => void;
  onReadArticle?: (articleId: string) => void;
}

export default function ArticleReader({ article, onBack, onAddComment, onLikeArticle, onSearchAi, onReadArticle }: ArticleReaderProps) {
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
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 md:pb-36">
      
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

      {/* Editorial Single Column Block (Optimized reading viewport) */}
      <div className="max-w-3xl mx-auto w-full flex flex-col space-y-5 text-neutral-800 text-sm md:text-base leading-relaxed">
        
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

          {/* Ask detikAI Contextual Prompting Section */}
          <div id="detikai-article-card" className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-white border border-purple-200 p-5 rounded-2xl shadow-sm my-6">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles size={16} className="text-purple-600 animate-pulse fill-purple-100" />
              <h4 className="font-headline font-extrabold text-xs uppercase tracking-wider text-purple-950">
                Tanya detikAI tentang Berita Ini
              </h4>
            </div>

            <p className="text-[11px] text-purple-900 leading-relaxed mb-4 font-semibold">
              Butuh penjelasan eksklusif? Ketik pertanyaan Anda di bawah atau tap salah satu usulan pertanyaan untuk berpindah langsung ke panduan asisten detikAI:
            </p>

            {/* Suggestions list */}
            <div className="flex gap-2 flex-wrap mb-4">
              {(ARTICLE_SUGGESTIONS_MAP[article.id] || [
                `Apa temuan utama dalam topik "${article.title}"?`,
                `Ringkas berita ini secara lengkap ✨`,
                `Apa implikasi penting dari kejadian ini?`,
                `Siapa saja tokoh kunci dalam artikel?`,
                `Apa latar belakang kronologi ini?`
              ]).map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    if (onSearchAi) {
                      onSearchAi(suggestion);
                    }
                  }}
                  type="button"
                  className="bg-white hover:bg-purple-650 hover:text-white text-purple-950 text-[11px] font-bold py-2 px-3.5 rounded-xl border border-purple-200/60 shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer select-none flex items-center space-x-1"
                >
                  <span className="text-purple-500 hover:text-white group-hover:text-white mr-1">✨</span>
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newsQuery.trim()) {
                  if (onSearchAi) {
                    onSearchAi(newsQuery.trim());
                    setNewsQuery('');
                  }
                }
              }} 
              className="flex items-center space-x-2 bg-white rounded-xl p-1.5 border border-purple-200 shadow-inner"
            >
              <input 
                type="text" 
                placeholder="Ajukan pertanyaan Anda kepada detikAI..."
                value={newsQuery}
                onChange={(e) => setNewsQuery(e.target.value)}
                className="flex-grow bg-transparent text-xs px-3 focus:outline-none placeholder-purple-300 font-sans font-extrabold text-neutral-800"
              />
              <button
                type="submit"
                disabled={!newsQuery.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white p-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-md h-8 px-3"
              >
                Tanyakan
              </button>
            </form>
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

          {/* Berita Populer Lainnya (Relocated beautifully below comments) */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <div className="flex items-center space-x-2 mb-5">
              <span className="text-xs font-black uppercase text-[#1a4d98] tracking-widest">Berita Populer Lainnya</span>
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {OTHER_TRENDING_NEWS.map((trend) => (
                <div 
                  key={trend.id}
                  onClick={() => {
                    if (onReadArticle) {
                      onReadArticle(trend.id);
                      const scroller = document.querySelector('.overflow-y-auto');
                      if (scroller) {
                        scroller.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }
                  }}
                  className="group cursor-pointer p-4 bg-white hover:bg-neutral-50/50 rounded-2xl border border-neutral-200 hover:border-neutral-300 shadow-xs hover:shadow-sm transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-0.5 active:scale-98"
                >
                  <div className="flex flex-col space-y-1">
                    <span className="text-[9px] font-black text-[#ff4f00] uppercase tracking-wider">{trend.category}</span>
                    <h5 className="font-headline font-semibold text-xs md:text-[13px] text-neutral-800 leading-snug line-clamp-2 group-hover:text-[#1a4d98] transition-colors">
                      {trend.title}
                    </h5>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono mt-3 self-start">{trend.readsCount.toLocaleString('id-ID')} views</span>
                </div>
              ))}
            </div>
          </div>

      </div>

    </div>
  );
}
