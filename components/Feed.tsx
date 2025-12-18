
import React from 'react';
import { Post } from '../types';
import PostCard from './PostCard';

interface FeedProps {
  posts: Post[];
  loading: boolean;
}

const Feed: React.FC<FeedProps> = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 bg-[#16161a] rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Story Bar */}
      <section className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex-shrink-0 w-20 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center group cursor-pointer hover:border-[#ff3b3f] transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#ff3b3f] group-hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tighter">Your Story</span>
        </div>

        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex-shrink-0 w-20 flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#ff3b3f] via-[#8b5cf6] to-[#2dd4bf] cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-2xl border-2 border-[#0a0a0c] overflow-hidden">
                <img src={`https://picsum.photos/seed/story${i}/200`} alt="Story" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 truncate w-20 text-center">User_{i}</span>
          </div>
        ))}
      </section>

      {/* Main Posts */}
      <div className="flex flex-col gap-12">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
