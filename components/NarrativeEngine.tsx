
import React, { useState, useEffect, useRef } from 'react';
import { Scene } from '../types';
import SceneComponent from './Scene';
import OmniMenu from './OmniMenu';
import { generatePersonalizedIntro } from '../services/geminiService';

interface NarrativeEngineProps {
  scenes: Scene[];
  activeIdx: number;
  onIdxChange: (idx: number) => void;
}

const NarrativeEngine: React.FC<NarrativeEngineProps> = ({ scenes, activeIdx, onIdxChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [intro, setIntro] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const isLocked = useRef<boolean>(false);
  const scrollAccumulator = useRef<number>(0);

  // Separate effect for Intro to minimize API hits
  useEffect(() => {
    if (!scenes[activeIdx]) return;
    const world = scenes[activeIdx].world;
    const introDebounce = setTimeout(() => {
      generatePersonalizedIntro(world).then(setIntro);
    }, 1500);
    return () => clearTimeout(introDebounce);
  }, [activeIdx, scenes]);
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isMenuOpen || isLocked.current) return;
      
      // Filter out micro-scrolls from trackpads
      scrollAccumulator.current += e.deltaY;
      
      if (Math.abs(scrollAccumulator.current) < 50) return;
      
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      const targetIdx = activeIdx + direction;

      if (targetIdx >= 0 && targetIdx < scenes.length) {
        // LOCK for the duration of the transition
        isLocked.current = true;
        onIdxChange(targetIdx);
        
        // Reset accumulation
        scrollAccumulator.current = 0;
        
        // Release lock after animation finishes
        setTimeout(() => {
          isLocked.current = false;
        }, 1000);
      } else {
        // Reset if we hit bounds
        scrollAccumulator.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scenes.length, activeIdx, isMenuOpen, onIdxChange]);

  // Calculate rail dimensions
  const railHeight = `${scenes.length * 100}%`;
  const sceneHeight = `${100 / scenes.length}%`;
  const translateValue = `-${(activeIdx / scenes.length) * 100}%`;

  return (
    <div className="h-full w-full bg-[#050505] overflow-hidden flex flex-col relative select-none animate-in fade-in duration-1000">
      {/* Narrative Progress Tracker */}
      <div className="absolute top-0 left-0 w-full h-1 z-[150] flex gap-2 px-8 py-10 pointer-events-none">
        {scenes.map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-[2px] rounded-full transition-all duration-700 ${i === activeIdx ? 'bg-[#ff3b3f] shadow-[0_0_20px_#ff3b3f]' : 'bg-white/5'}`} 
          />
        ))}
      </div>

      {/* Threshold Intro HUD */}
      <div className={`absolute top-16 left-12 z-40 transition-all duration-1000 pointer-events-none ${activeIdx === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        <p className="text-[10px] uppercase tracking-[0.8em] font-black text-[#ff3b3f] mb-4">Transmission Active</p>
        <h1 className="text-4xl font-light italic text-white/90 max-w-xl leading-snug drop-shadow-2xl">
          {intro || 'Initiating narrative sequence...'}
        </h1>
      </div>

      {/* Main Cinematic Stack (Sliding Rail) */}
      <div 
        ref={containerRef}
        className="w-full relative transition-transform duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ 
          height: railHeight,
          transform: `translateY(${translateValue})` 
        }}
      >
        {scenes.map((scene, idx) => (
          <div 
            key={scene.id} 
            className="w-full relative"
            style={{ height: sceneHeight }}
          >
            <SceneComponent 
              scene={scene} 
              isActive={idx === activeIdx} 
              onIntent={() => setIsMenuOpen(true)}
            />
          </div>
        ))}
      </div>

      {/* Observation Interface */}
      <OmniMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        scene={scenes[activeIdx]} 
      />
    </div>
  );
};

export default NarrativeEngine;
