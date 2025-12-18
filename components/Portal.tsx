
import React, { useState, useEffect } from 'react';
import { generatePersonalizedIntro } from '../services/geminiService';

interface PortalProps {
  onEnter: (world: string) => void;
}

const WORLDS = [
  { id: 'film', label: 'Cinematheque', description: 'The movement of light.', color: '#ff3b3f' },
  { id: 'art', label: 'Fine Archive', description: 'Ancestral memories.', color: '#8b5cf6' },
  { id: 'music', label: 'Sonic Soul', description: 'Silence between notes.', color: '#2dd4bf' },
  { id: 'fashion', label: 'The Fabric', description: 'Identity in motion.', color: '#fbbf24' },
];

const Portal: React.FC<PortalProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<'VOID' | 'TITLE' | 'WORLDS'>('VOID');
  const [introText, setIntroText] = useState('');
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);

  useEffect(() => {
    // Stage 1: The Void -> Title
    const timer1 = setTimeout(() => setStage('TITLE'), 1000);
    // Stage 2: Title -> Worlds
    const timer2 = setTimeout(() => setStage('WORLDS'), 4000);

    generatePersonalizedIntro("The Curator").then(setIntroText);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Visual Texture */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-[#050505] transition-opacity duration-[3000ms] ${stage === 'VOID' ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop" 
            className={`w-full h-full object-cover transition-all duration-[5000ms] ease-out ${stage !== 'VOID' ? 'scale-100' : 'scale-125'}`} 
            alt="background texture"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
      </div>

      {/* Stage: TITLE */}
      <div className={`absolute transition-all duration-[2000ms] ease-in-out z-10 text-center ${stage === 'TITLE' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <p className="text-[10px] uppercase tracking-[1em] text-white/30 mb-8 font-black animate-pulse">Establishing Connection</p>
        <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter text-white leading-none">
          TRIBBBAL
        </h1>
        <p className="mt-8 text-white/40 italic font-light tracking-widest text-lg">
          {introText || 'Universal diaspora narrative.'}
        </p>
      </div>

      {/* Stage: WORLDS */}
      <div className={`absolute inset-0 z-20 transition-all duration-[1500ms] ease-out flex flex-col items-center justify-center ${stage === 'WORLDS' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        
        {/* Minimal Floating Brand Mark */}
        <div className="absolute top-12 flex flex-col items-center gap-2">
           <div className="w-1 h-12 bg-[#ff3b3f] mb-2"></div>
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Select Your Lens</span>
        </div>

        {/* The World Thresholds */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          {WORLDS.map((world) => (
            <button
              key={world.id}
              onMouseEnter={() => setHoveredWorld(world.id)}
              onMouseLeave={() => setHoveredWorld(null)}
              onClick={() => onEnter(world.id)}
              className="group relative flex flex-col items-center gap-6"
            >
              {/* The "Lens" Visual */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                 {/* Decorative Rings */}
                 <div className={`absolute inset-0 border border-white/5 rounded-full transition-all duration-700 ${hoveredWorld === world.id ? 'scale-150 opacity-100 border-[#ff3b3f]/30' : 'scale-100 opacity-20'}`}></div>
                 <div className={`absolute inset-4 border border-white/10 rounded-full transition-all duration-1000 delay-100 ${hoveredWorld === world.id ? 'scale-125 opacity-100 border-[#ff3b3f]/50' : 'scale-100 opacity-20'}`}></div>
                 
                 {/* The Core */}
                 <div className={`w-3 h-3 rounded-full transition-all duration-500 ${hoveredWorld === world.id ? 'bg-[#ff3b3f] scale-150 shadow-[0_0_20px_#ff3b3f]' : 'bg-white/20'}`}></div>
              </div>

              {/* Textual Identity */}
              <div className="text-center transition-all duration-500 group-hover:-translate-y-2">
                <h3 className={`text-xl font-black uppercase tracking-[0.2em] transition-colors ${hoveredWorld === world.id ? 'text-white' : 'text-white/40'}`}>
                  {world.label}
                </h3>
                <p className={`text-[10px] font-medium tracking-widest uppercase transition-all duration-500 overflow-hidden ${hoveredWorld === world.id ? 'max-h-10 opacity-60 mt-2' : 'max-h-0 opacity-0'}`}>
                  {world.description}
                </p>
              </div>

              {/* Enter Indicator (Hold intent) */}
              <div className={`absolute -bottom-12 transition-all duration-500 ${hoveredWorld === world.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                 <span className="text-[8px] font-black tracking-[0.4em] text-[#ff3b3f] uppercase">Hold to Transmit</span>
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Noise/Score Control */}
        <div className="absolute bottom-12 flex items-center gap-4 text-white/20 hover:text-white/60 transition-colors cursor-pointer">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H7"/><path d="M17 19H7"/><path d="M21 9H3"/><path d="M21 15H3"/></svg>
           <span className="text-[10px] uppercase tracking-widest font-black">Score: Ambient / Noir</span>
        </div>
      </div>
    </div>
  );
};

export default Portal;
