
import React, { useState } from 'react';
import { Post } from '../types';
import { Icons } from '../constants';
import { generatePostInsights } from '../services/geminiService';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const toggleInsights = async () => {
    if (showInsights) {
      setShowInsights(false);
      return;
    }

    setShowInsights(true);
    if (!insights) {
      setLoadingInsights(true);
      const data = await generatePostInsights(post.content);
      setInsights(data);
      setLoadingInsights(false);
    }
  };

  return (
    <article className="group relative bg-[#16161a] rounded-[2.5rem] overflow-hidden cinematic-shadow transition-all duration-500 hover:shadow-2xl hover:shadow-[#ff3b3f]/10 border border-white/5">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ff3b3f]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      {/* Header */}
      <div className="p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
            </div>
            {post.author.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#16161a] rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="text-white font-bold leading-tight group-hover:text-[#ff3b3f] transition-colors">{post.author.name}</h3>
            <p className="text-xs text-slate-500 tracking-wide">{post.author.handle} • {post.timestamp}</p>
          </div>
        </div>
        <button className="p-2 text-slate-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-lg font-medium text-slate-200 leading-relaxed mb-4">
          {post.content}
        </p>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="relative overflow-hidden aspect-video bg-black/40 group-hover:scale-[1.01] transition-transform duration-700 ease-out">
          <img 
            src={post.mediaUrl} 
            alt="Post content" 
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
          />
          
          {post.type === 'artwork' && post.price && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2">
               <div className="glass-effect px-4 py-2 rounded-xl">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Sale</span>
                 <span className="text-white font-black text-xl">{post.price}</span>
               </div>
            </div>
          )}

          {post.type === 'event' && post.location && (
            <div className="absolute bottom-6 left-6 glass-effect px-4 py-2 rounded-xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff3b3f]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="text-white text-sm font-semibold">{post.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer / Actions */}
      <div className="p-6 flex items-center justify-between border-t border-white/5 relative z-10">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-2 transition-all hover:scale-110 active:scale-90 ${isLiked ? 'text-[#ff3b3f]' : 'text-slate-400'}`}
          >
            <Icons.Heart filled={isLiked} />
            <span className="text-sm font-bold">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-all">
            <Icons.Comment />
            <span className="text-sm font-bold">{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-all">
            <Icons.Share />
          </button>
        </div>

        <button 
          onClick={toggleInsights}
          className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showInsights ? 'bg-[#ff3b3f] text-white' : 'bg-white/5 text-[#ff3b3f] hover:bg-white/10'}`}
        >
          <Icons.Sparkles />
          <span className="text-xs font-bold uppercase tracking-wider">GenUI Insights</span>
        </button>
      </div>

      {/* GenUI Insights Panel */}
      {showInsights && (
        <div className="p-8 bg-[#0d0d0f] border-t border-[#ff3b3f]/20 animate-in slide-in-from-bottom duration-500">
          {loadingInsights ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <div className="w-2 h-2 bg-[#ff3b3f] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-[#2dd4bf] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          ) : insights ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-[#ff3b3f] text-xs font-black uppercase tracking-widest mb-3">Cinematic Vibe</h4>
                <p className="text-xl font-light text-slate-300 italic leading-relaxed">
                  "{insights.vibeSummary}"
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {insights.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-[10px] font-bold text-slate-500 uppercase border border-slate-800 px-2 py-1 rounded-md">#{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Icons.Sparkles />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">AI UI Suggestion</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{insights.uiSuggestion}</p>
                  <div className="flex gap-2">
                    {insights.colorPalette.map((color: string, i: number) => (
                      <div key={i} className="w-8 h-8 rounded-lg shadow-lg" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">Insights temporarily unavailable</p>
          )}
        </div>
      )}
    </article>
  );
};

export default PostCard;
