
import React, { useState, useEffect, useRef } from 'react';
import { Scene } from '../types';

interface SceneProps {
  scene: Scene;
  isActive: boolean;
  onIntent: () => void;
}

const SceneComponent: React.FC<SceneProps> = ({ scene, isActive, onIntent }) => {
  const [revealMeta, setRevealMeta] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  
  // Track play promises separately to handle interruptions correctly
  const videoPromiseRef = useRef<Promise<void> | null>(null);
  const bgVideoPromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let isCancelled = false;

    if (isActive) {
      const timer = setTimeout(() => {
        if (!isCancelled) setRevealMeta(true);
      }, 500); // Faster reveal for immediate feedback
      
      const playMedia = (el: HTMLVideoElement | null, promiseRef: React.MutableRefObject<Promise<void> | null>) => {
        if (!el) return;
        
        // Reset time
        el.currentTime = 0;
        
        // Attempt play
        const promise = el.play();
        if (promise !== undefined) {
          promiseRef.current = promise;
          promise.catch(e => {
            // Ignore AbortError which happens if we pause while loading
            if (e.name !== 'AbortError') {
              console.warn("Playback failed:", e.message);
            }
          });
        }
      };

      playMedia(videoRef.current, videoPromiseRef);
      playMedia(bgVideoRef.current, bgVideoPromiseRef);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
        
        const safePause = (el: HTMLVideoElement | null, promiseRef: React.MutableRefObject<Promise<void> | null>) => {
          if (!el) return;
          const promise = promiseRef.current;
          
          if (promise) {
            // Wait for play to resolve/reject before pausing to avoid "interrupted" error
            promise.finally(() => {
               // Check if we still want to pause (in case component re-mounted), 
               // but for cleanup usually yes.
               // We catch inside playMedia so finally should always run.
               el.pause();
            });
          } else {
            el.pause();
          }
        };

        safePause(videoRef.current, videoPromiseRef);
        safePause(bgVideoRef.current, bgVideoPromiseRef);
      };
    } else {
      setRevealMeta(false);
      videoRef.current?.pause();
      bgVideoRef.current?.pause();
    }
  }, [isActive]);

  // Dynamic Object Fit based on Modality & Device context
  const getDesktopObjectFit = () => {
    if (scene.modality === 'photo' || scene.modality === 'product') return 'md:object-contain';
    // Allow slight crop for cinematic video, but respect aspect ratio more than full cover if needed
    return 'md:object-cover';
  };

  const getMobileObjectFit = () => {
    return 'object-cover';
  };

  return (
    <div 
      className="w-full h-full relative flex items-center justify-center bg-[#050505] overflow-hidden cursor-crosshair group/scene"
      onClick={onIntent}
    >
      {/* 
         LAYER 0: GLOBAL THEATER BACKGROUND 
         Only visible on Desktop/Tablet to create the "Theater" ambience around the canvas.
      */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-40' : 'opacity-0'} hidden md:block overflow-hidden pointer-events-none z-0`}>
        <div className="absolute inset-[-20%] scale-125 blur-[120px] saturate-[1.5] brightness-[0.5]">
           {scene.mediaType === 'video' ? (
            <video
              ref={bgVideoRef}
              src={scene.mediaUrl}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={scene.mediaUrl} 
              className="w-full h-full object-cover"
              alt=""
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* 
         LAYER 1: THE CANVAS (THE STAGE)
         Mobile: Full bleed absolute.
         Desktop: Centered, clamped dimensions, split layout.
      */}
      <div className={`
        relative z-10 transition-all duration-1000 ease-out
        w-full h-full md:w-[clamp(960px,86vw,1440px)] md:h-[clamp(520px,70vh,820px)]
        flex flex-col md:flex-row
        md:bg-[#0a0a0c] md:rounded-[2.5rem] md:border md:border-white/5 md:shadow-2xl md:overflow-hidden
        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        
        {/* 
           SECTION A: TYPOGRAPHY RAIL (Left on Desktop, Overlay on Mobile)
           On Mobile: absolute inset-0 z-20 flex col justify-end.
           On Desktop: relative w-[44%] h-full flex col justify-center.
        */}
        <div className={`
          absolute inset-0 z-20 flex flex-col justify-end p-8 pb-32 md:pb-8
          bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-none
          md:relative md:inset-auto md:w-[44%] md:h-full md:justify-center md:pl-16 md:pr-8 md:z-10
        `}>
          <div className={`transition-all duration-1000 delay-300 ${revealMeta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Top Tags */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
               <span className="px-3 py-1 rounded-full border border-[#ff3b3f]/40 bg-[#ff3b3f]/10 text-[9px] md:text-[clamp(10px,0.8vw,12px)] font-black uppercase tracking-[0.2em] text-[#ff3b3f] backdrop-blur-md">
                {scene.modality}
               </span>
               <span className="text-[10px] md:text-[clamp(11px,0.9vw,13px)] font-black text-white/50 uppercase tracking-[0.3em]">
                {scene.tone}
               </span>
            </div>

            {/* Director Block */}
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
               <div className="w-1 h-12 md:h-20 bg-[#ff3b3f] shadow-[0_0_20px_#ff3b3f]"></div>
               <div>
                 <p className="text-[9px] md:text-[clamp(10px,0.8vw,12px)] font-black uppercase tracking-[0.5em] text-[#ff3b3f] mb-1">
                   {scene.director.role}
                 </p>
                 <h2 className="text-3xl md:text-[clamp(32px,3vw,56px)] font-black tracking-tighter text-white leading-none mb-1">
                   {scene.director.name}
                 </h2>
                 <p className="text-[10px] md:text-[clamp(11px,0.9vw,13px)] text-white/40 font-bold tracking-[0.3em] uppercase">
                   {scene.director.city}
                 </p>
               </div>
            </div>

            {/* Main Headline */}
            <h3 className="
              text-4xl md:text-[clamp(40px,4.6vw,82px)] 
              font-black tracking-tighter leading-[0.95] 
              text-white mb-8 md:mb-16 drop-shadow-2xl
              max-w-full
            ">
              {scene.narrative}
            </h3>

            {/* Metadata Grid */}
            <div className="hidden md:flex flex-wrap items-start gap-x-12 gap-y-8 text-white/40">
              <div className="flex flex-col">
                 <span className="text-[9px] md:text-[clamp(10px,0.7vw,11px)] uppercase tracking-[0.4em] text-[#ff3b3f] mb-2">Vibe</span>
                 <span className="text-sm md:text-[clamp(12px,1vw,15px)] text-white/90 tracking-widest uppercase font-bold">{scene.vibe}</span>
              </div>
              {scene.metadata?.location && (
                 <div className="flex flex-col">
                   <span className="text-[9px] md:text-[clamp(10px,0.7vw,11px)] uppercase tracking-[0.4em] text-[#ff3b3f] mb-2">Anchor</span>
                   <span className="text-sm md:text-[clamp(12px,1vw,15px)] text-white/90 tracking-widest uppercase font-bold">{scene.metadata.location}</span>
                 </div>
              )}
            </div>

          </div>
        </div>

        {/* 
           SECTION B: MEDIA CANVAS (Right on Desktop, Full on Mobile)
           On Mobile: absolute inset-0 z-0.
           On Desktop: relative w-[56%] h-full z-0 overflow-hidden bg-black.
        */}
        <div className={`
          absolute inset-0 z-0
          md:relative md:inset-auto md:w-[56%] md:h-full md:bg-black
        `}>
           <div className={`w-full h-full relative transition-all duration-1000 ${scene.modality === 'product' ? 'scale-100 md:scale-[1.03]' : 'scale-100'}`}>
              {scene.mediaType === 'video' ? (
                <video
                  ref={videoRef}
                  src={scene.mediaUrl}
                  className={`w-full h-full ${getMobileObjectFit()} ${getDesktopObjectFit()}`}
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img 
                  src={scene.mediaUrl} 
                  alt={scene.narrative} 
                  className={`w-full h-full ${getMobileObjectFit()} ${getDesktopObjectFit()}`}
                />
              )}
              
              {/* Audio Modality Visualizer */}
              {scene.modality === 'audio' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 mix-blend-screen">
                  <div className="w-[40%] aspect-square border border-white/40 rounded-full animate-ping [animation-duration:4s]"></div>
                  <div className="absolute w-[60%] aspect-square border border-white/20 rounded-full animate-ping [animation-duration:6s]"></div>
                </div>
              )}
           </div>
           
           {/* Desktop Vignette for transition blending */}
           <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0c]/80 pointer-events-none"></div>
        </div>

      </div>

      {/* Floating Elements (Outside Canvas) */}
      
      {/* Navigation Intent Hint */}
      <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-1500 z-50 pointer-events-none ${revealMeta ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-8'}`}>
         <div className="w-[2px] h-12 bg-gradient-to-t from-[#ff3b3f] to-transparent animate-pulse shadow-[0_0_15px_#ff3b3f]"></div>
         <span className="text-[9px] font-black uppercase tracking-[1em] text-white">Tap to Deepen</span>
      </div>

    </div>
  );
};

export default SceneComponent;
