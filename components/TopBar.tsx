
import React from 'react';
import { User } from '../types';
import { Icons } from '../constants';

interface TopBarProps {
  user: User;
}

const TopBar: React.FC<TopBarProps> = ({ user }) => {
  return (
    <header className="h-20 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#ff3b3f] transition-colors">
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search for people, posts, hashtags..." 
            className="w-full bg-[#16161a] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff3b3f]/30 focus:border-[#ff3b3f]/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <div className="hidden md:flex items-center gap-4 text-slate-400">
           <button className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
             <Icons.Notifications />
             <span className="absolute top-2 right-2 w-2 h-2 bg-[#ff3b3f] rounded-full"></span>
           </button>
           <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
             <Icons.Message />
           </button>
        </div>
        
        <div className="h-8 w-[1px] bg-white/5 hidden md:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white group-hover:text-[#ff3b3f] transition-colors">{user.name}</p>
            <p className="text-xs text-slate-500 uppercase tracking-widest">{user.handle}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden border border-white/10 group-hover:border-[#ff3b3f] transition-colors">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
