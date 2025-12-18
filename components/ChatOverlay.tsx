
import React, { useState } from 'react';
import { User, ChatSession } from '../types';

interface ChatOverlayProps {
  chats: ChatSession[];
  onClose: (userId: string) => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ chats, onClose }) => {
  const [minimized, setMinimized] = useState<string[]>([]);

  const toggleMinimize = (userId: string) => {
    if (minimized.includes(userId)) {
      setMinimized(minimized.filter(id => id !== userId));
    } else {
      setMinimized([...minimized, userId]);
    }
  };

  return (
    <div className="fixed bottom-0 right-28 flex flex-row-reverse gap-4 z-40 items-end">
      {chats.map(chat => {
        const isMin = minimized.includes(chat.user.id);
        return (
          <div 
            key={chat.user.id}
            className={`w-72 bg-[#16161a] rounded-t-[1.5rem] cinematic-shadow border border-white/10 transition-all duration-300 flex flex-col ${isMin ? 'h-14' : 'h-96'}`}
          >
            {/* Header */}
            <div 
              className="p-4 flex items-center justify-between cursor-pointer border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent rounded-t-[1.5rem]"
              onClick={() => toggleMinimize(chat.user.id)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                    <img src={chat.user.avatar} alt={chat.user.name} className="w-full h-full object-cover" />
                  </div>
                  {chat.user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#16161a] rounded-full"></div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{chat.user.name}</p>
                  {!isMin && <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest">Online</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onClose(chat.user.id); }}
                  className="p-1 hover:bg-white/10 rounded-md text-slate-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMin && (
              <>
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                  <div className="text-center py-4">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">Conversation started</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none max-w-[85%]">
                    <p className="text-xs text-slate-300">Hey there! Really loved your latest post on Afrofuturism. We should collaborate sometime!</p>
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-[#0d0d0f]">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="w-full bg-[#1c1c21] border border-white/5 rounded-xl py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff3b3f]/50 transition-all"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#ff3b3f] p-1 hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatOverlay;
