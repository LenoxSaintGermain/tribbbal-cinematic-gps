
import React, { useState, useEffect, useRef } from 'react';
import { Scene } from '../types';

interface SceneProps {
  scene: Scene;
  isActive: boolean;
  onIntent: () => void;
}

const SceneComponent: React.FC<SceneProps> = ({ scene, isActive, onIntent }) => {
  const [revealMeta, setRevealMeta] = useState(false);
  const [showHint, setShowHint] = useState(false);
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
      
      // Mobile Gesture Hint logic
      setShowHint(true);
      const hintTimer = setTimeout(() => {
        if (!isCancelled) setShowHint(false);
      }, 3000);

      const playMedia = (el: HTMLVideoElement | null, promiseRef: React.MutableRefObject<Promise<void> | null>) => {
        if (!el) return;
        el.currentTime = 0;
        const promise = el.play();
        if (promise !== undefined) {
          promiseRef.current = promise;
          promise.catch(e => {
            if (e.name !== 'AbortError') console.warn("Playback failed:", e.message);
          });
        }
      };

      playMedia(videoRef.current, videoPromiseRef);
      playMedia(bgVideoRef.current, bgVideoPromiseRef);

      return () => {
        isCancelled = true;
        clearTimeout(timer);
        clearTimeout(hintTimer);
        
        const safePause = (el: HTMLVideoElement | null, promiseRef: React.MutableRefObject<Promise<void> | null>) => {
          if (!el) return;
          const promise = promiseRef.current;
          if (promise) {
            promise.finally(() => el.pause());
          } else {
            el.pause();
          }
        };

        safePause(videoRef.current, videoPromiseRef);
        safePause(bgVideoRef.current, bgVideoPromiseRef);
      };
    } else {
      setRevealMeta(false);
      setShowHint(false);
      videoRef.current?.pause();
      bgVideoRef.current?.pause();
    }
  }, [isActive]);

  const getDesktopObjectFit = () => {
    if (scene.modality === 'photo' || scene.modality === 'product') return 'md:object-contain';
    return 'md:object-cover';
  };

  return (
    <div 
      className="w-full h-[100dvh] relative bg-[#050505] overflow-hidden cursor-crosshair group/scene select-none"
      onClick={onIntent}
    >
      {/* 
         LAYER 0: GLOBAL THEATER BACKGROUND 
         Only visible on Desktop/Tablet (md+)
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
         LAYER 1: SCENE CONTAINER
         Mobile: Full Bleed (w-full h-full), No rounded corners
         Desktop: Theater Canvas (clamped width/height, rounded)
      */}
      <div className={`
        relative z-10 transition-all duration-1000 ease-out
        w-full h-full
        md:w-[clamp(960px,86vw,1440px)] md:h-[clamp(520px,70vh,820px)]
        md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:flex md:flex-row
        md:bg-[#0a0a0c] md:rounded-[2.5rem] md:border md:border-white/5 md:shadow-2xl md:overflow-hidden
        ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        
        {/* 
           SECTION B: MEDIA CANVAS
           Mobile: Background Layer (Absolute Full)
           Desktop: Right Side Block (Relative)
        */}
        <div className={`
          absolute inset-0 z-0
          md:relative md:inset-auto md:order-2 md:w-[52%] md:h-full md:bg-black
        `}>
           <div className={`w-full h-full relative transition-transform duration-1000 ${scene.modality === 'product' ? 'scale-100 md:scale-[1.03]' : 'scale-100'}`}>
              {scene.mediaType === 'video' ? (
                <video
                  ref={videoRef}
                  src={scene.mediaUrl}
                  className={`w-full h-full object-cover object-[center_35%] md:object-center ${getDesktopObjectFit()}`}
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                />
              ) : (
                <img 
                  src={scene.mediaUrl} 
                  alt={scene.narrative} 
                  className={`w-full h-full object-cover object-[center_35%] md:object-center ${getDesktopObjectFit()}`}
                />
              )}
              
              {/* Audio Visualizer */}
              {scene.modality === 'audio' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 mix-blend-screen">
                  <div className="w-[40%] aspect-square border border-white/40 rounded-full animate-ping [animation-duration:4s]"></div>
                  <div className="absolute w-[60%] aspect-square border border-white/20 rounded-full animate-ping [animation-duration:6s]"></div>
                </div>
              )}
           </div>
           
           {/* Desktop Vignette */}
           <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0c]/80 pointer-events-none"></div>
        </div>

        {/* 
           SECTION A: TYPOGRAPHY / OVERLAY
           Mobile: Bottom Overlay, Constrained Height
           Desktop: Left Side Rail
        */}
        <div className={`
          absolute inset-x-0 bottom-0 z-20 pointer-events-none
          md:pointer-events-auto md:relative md:inset-auto md:order-1 md:w-[48%] md:h-full md:bg-none
        `}>
          {/* Mobile Text Scrim (Refined Liquid Dark) */}
          <div className="md:hidden absolute inset-x-0 bottom-0 h-[55vh] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none"></div>
          
          {/* Mobile Glass Edge Hint */}
          <div className="md:hidden absolute inset-x-0 bottom-0 h-[35vh] border-t border-white/5 backdrop-blur-[1px] opacity-50 pointer-events-none"></div>

          <div className={`
            relative z-10 flex flex-col justify-end h-full
            pb-[calc(env(safe-area-inset-bottom)+20px)]
            md:pb-0 md:justify-center md:pl-10 md:pr-6
          `}>
            <div className={`
              transition-all duration-1000 delay-300 
              ${revealMeta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              /* Mobile Constraints */
              w-full max-w-[92vw] mx-auto 
              max-h-[45dvh] flex flex-col justify-end
              md:max-w-full md:max-h-none md:mx-0
            `}>
              
              {/* Tags */}
              <div className="flex items-center gap-3 mb-3 md:mb-8">
                 <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-[#ff3b3f]/40 bg-[#ff3b3f]/10 text-[9px] md:text-[clamp(10px,0.8vw,12px)] font-black uppercase tracking-[0.2em] text-[#ff3b3f] md:backdrop-blur-md">
                  {scene.modality}
                 </span>
                 <span className="text-[9px] md:text-[clamp(11px,0.9vw,13px)] font-black text-white/70 md:text-white/50 uppercase tracking-[0.3em] shadow-black drop-shadow-md">
                  {scene.tone}
                 </span>
              </div>

              {/* Director Block */}
              <div className="flex items-center gap-3 md:gap-6 mb-3 md:mb-10">
                 <div className="w-0.5 h-8 md:w-1 md:h-20 bg-[#ff3b3f] shadow-[0_0_20px_#ff3b3f]"></div>
                 <div>
                   <p className="text-[8px] md:text-[clamp(10px,0.8vw,12px)] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#ff3b3f] mb-0.5 md:mb-1 shadow-black drop-shadow-sm">
                     {scene.director.role}
                   </p>
                   <h2 className="text-xl md:text-[clamp(32px,3vw,56px)] font-black tracking-tighter text-white leading-none mb-0.5 md:mb-1 shadow-black drop-shadow-lg">
                     {scene.director.name}
                   </h2>
                   <p className="text-[9px] md:text-[clamp(11px,0.9vw,13px)] text-white/60 md:text-white/40 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase shadow-black drop-shadow-md">
                     {scene.director.city}
                   </p>
                 </div>
              </div>

              {/* Main Headline */}
              <h3 className="
                text-[clamp(28px,8vw,42px)] leading-[1.05]
                md:text-[clamp(40px,4.6vw,82px)] md:leading-[0.95]
                font-black tracking-tighter 
                text-white mb-4 md:mb-16 drop-shadow-xl
                line-clamp-4 md:line-clamp-none
              ">
                {scene.narrative}
              </h3>

              {/* Mobile Metadata Row (Refined) */}
              <div className="md:hidden flex items-center gap-4 text-white/60 mb-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md border border-white/10 px-2 py-1 rounded-md bg-black/20">{scene.vibe}</span>
                 {scene.metadata?.location && (
                   <>
                     <span className="w-0.5 h-3 bg-white/20"></span>
                     <span className="text-[10px] font-bold uppercase tracking-widest drop-shadow-md">{scene.metadata.location}</span>
                   </>
                 )}
              </div>

              {/* Desktop Metadata Grid */}
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
        </div>

      </div>

      {/* Mobile Gesture Hint */}
      <div className={`
        md:hidden absolute bottom-[calc(env(safe-area-inset-bottom)+8px)] left-0 right-0 z-30 pointer-events-none 
        flex flex-col items-center justify-center gap-1
        transition-opacity duration-1000
      `} style={{ opacity: showHint ? 0.6 : 0 }}>
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/50 drop-shadow-md">Swipe up for routes</span>
      </div>

      {/* Desktop Floating Deepen Hint */}
      <div className={`absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 transition-all duration-1500 z-50 pointer-events-none ${revealMeta ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-8'} hidden md:flex`}>
         <div className="w-[2px] h-12 bg-gradient-to-t from-[#ff3b3f] to-transparent animate-pulse shadow-[0_0_15px_#ff3b3f]"></div>
         <span className="text-[9px] font-black uppercase tracking-[1em] text-white">Tap to Deepen</span>
      </div>

    </div>
  );
};

export default SceneComponent;
