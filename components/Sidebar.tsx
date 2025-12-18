
import React from 'react';
import { Icons, COLORS } from '../constants';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Icons.Home />, color: COLORS.primary, label: 'Feed' },
    { icon: <Icons.Search />, color: COLORS.accent, label: 'Explore' },
    { icon: <Icons.Notifications />, color: '#fbbf24', label: 'Alerts' },
    { icon: <Icons.Message />, color: COLORS.secondary, label: 'Chats' },
    { icon: <Icons.Settings />, color: '#94a3b8', label: 'Settings' },
  ];

  return (
    <aside className="w-20 md:w-24 flex-shrink-0 bg-[#111114] border-r border-white/5 flex flex-col items-center py-8 z-20 h-full">
      <div className="mb-12 cursor-pointer flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-[#ff3b3f] to-[#8b5cf6] rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-500/20">
          T
        </div>
      </div>

      <nav className="flex flex-col gap-8 flex-1 overflow-y-auto custom-scrollbar no-scrollbar py-2 w-full items-center">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className="group relative flex flex-col items-center cursor-pointer flex-shrink-0"
            title={item.label}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/5"
              style={{ color: item.color }}
            >
              {item.icon}
            </div>
            {idx === 0 && (
              <div className="absolute -left-1 w-1 h-6 bg-[#ff3b3f] rounded-r-full top-1/2 -translate-y-1/2" />
            )}
            <span className="text-[10px] mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
              {item.label}
            </span>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex-shrink-0">
        <div className="w-10 h-10 rounded-full border border-white/10 p-0.5 overflow-hidden cursor-pointer hover:border-[#ff3b3f] transition-colors">
          <img src="https://picsum.photos/seed/user/100" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
