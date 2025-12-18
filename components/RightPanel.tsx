
import React from 'react';
import { User } from '../types';

interface RightPanelProps {
  onUserClick: (user: User) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onUserClick }) => {
  const trending = [
    { tag: '#BlackCreativity', posts: '12.4k' },
    { tag: '#TribbbalVibes', posts: '8.1k' },
    { tag: '#Afrofuturism', posts: '42.9k' },
    { tag: '#JazzWinterFest', posts: '2.4k' },
  ];

  const suggestedUsers: User[] = [
    { id: 'su1', name: 'Zahara Moon', handle: '@zahara_m', avatar: 'https://picsum.photos/seed/zahara/100', isOnline: true },
    { id: 'su2', name: 'Kofi King', handle: '@koking', avatar: 'https://picsum.photos/seed/kofi/100', isOnline: true },
    { id: 'su3', name: 'Amara West', handle: '@awest_art', avatar: 'https://picsum.photos/seed/amara/100', isOnline: false },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[350px] flex-shrink-0 border-l border-white/5 bg-[#0a0a0c] p-6 gap-8 overflow-y-auto custom-scrollbar h-full">
      {/* Trending Section */}
      <section className="bg-[#16161a] rounded-3xl p-6 border border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Trending</h3>
          <button className="text-[#ff3b3f] text-xs font-bold uppercase tracking-widest hover:underline">Refresh</button>
        </div>
        <div className="flex flex-col gap-6">
          {trending.map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <p className="text-[#ff3b3f] font-black group-hover:underline">{item.tag}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{item.posts} Posts</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Users */}
      <section className="bg-[#16161a] rounded-3xl p-6 border border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Who to follow</h3>
          <button className="text-[#ff3b3f] text-xs font-bold uppercase tracking-widest hover:underline">See All</button>
        </div>
        <div className="flex flex-col gap-5">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between group">
              <div 
                className="flex items-center gap-3 cursor-pointer overflow-hidden"
                onClick={() => onUserClick(user)}
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ff3b3f] transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white leading-tight group-hover:text-[#ff3b3f] transition-colors truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest truncate">{user.handle}</p>
                </div>
              </div>
              <button className="w-8 h-8 flex-shrink-0 rounded-lg bg-white/5 hover:bg-[#ff3b3f] hover:text-white transition-all flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="flex-shrink-0 pb-6">
         <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Gallery Drops</h3>
         <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-white/5 relative">
                <img src={`https://picsum.photos/seed/product${i}/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-bold truncate">Item {i}</p>
                  <p className="text-[#ff3b3f] text-[10px] font-black">$450</p>
                </div>
              </div>
            ))}
         </div>
         <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors">
           View Full Catalog
         </button>
      </section>
    </aside>
  );
};

export default RightPanel;
