
import React, { useState, useEffect } from 'react';
import { Scene } from '../types';
import { getSceneNarrative } from '../services/geminiService';

interface OmniMenuProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Scene;
}

const OmniMenu: React.FC<OmniMenuProps> = ({ isOpen, onClose, scene }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'OBSERVE' | 'CREATOR' | 'CONTEXT'>('OBSERVE');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setActiveLayer('OBSERVE');
      
      const fetchAnalysis = async () => {
        try {
          const res = await getSceneNarrative(`Modality: ${scene.modality}. Narrative: ${scene.narrative}. Role: ${scene.director.role}`);
          setData(res);
        } catch (error) {
          console.error("Analysis failed", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAnalysis();
    } else {
      setData(null);
    }
  }, [isOpen, scene.id]);

  if (!isOpen) return null;

  // LAYER 1: OBSERVE (Curator's Placard + Collector's Glance)
  const renderObserve = () => (
    <div className="flex flex-col h-full animate-in fade-in zoom-in duration-500">
      
      {/* TOP HALF: IDENTITY & INTERPRETATION */}
      <div className="flex flex-col md:flex-row gap-12 mb-12 flex-1 min-h-0">
        
        {/* Left: Creator & Intent */}
        <div className="flex-1">
          <div className="flex items-center gap-6 mb-8">
             <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-white/5">
                <img src={scene.director.avatar} className="w-full h-full object-cover" alt="Director" />
             </div>
             <div>
                <p className="text-[9px] text-[#ff3b3f] font-black uppercase tracking-[0.2em] mb-1">{scene.director.role} • {scene.director.city}</p>
                <h4 className="text-2xl font-black tracking-tighter text-white">{scene.director.name}</h4>
             </div>
          </div>
          <div>
            <h5 className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 mb-3">Cinematic Intent</h5>
            <p className="text-white/70 text-lg font-light italic leading-relaxed">
              "{scene.cinematicIntent}"
            </p>
          </div>
        </div>

        {/* Right: Curator's Voice */}
        <div className="flex-1 bg-white/5 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
           </div>
           <p className="text-[9px] uppercase font-black tracking-[0.3em] text-[#ff3b3f] mb-4">Curator's Analysis</p>
           {loading ? (
             <div className="space-y-3 animate-pulse">
               <div className="h-4 bg-white/10 rounded w-full"></div>
               <div className="h-4 bg-white/10 rounded w-3/4"></div>
             </div>
           ) : (
             <p className="text-white/90 text-lg font-serif italic leading-relaxed">
               "{data?.curatorNote || 'Analyzing the composition and cultural resonance...'}"
             </p>
           )}
        </div>
      </div>

      {/* BOTTOM HALF: THE OBJECT & ENGAGEMENT */}
      <div className="pt-8 border-t border-white/10 flex flex-col gap-8">
         
         {/* Zone A: The Object Rail (Museum Specification) */}
         <div className="flex flex-wrap gap-x-12 gap-y-4 items-center opacity-80">
            {loading ? (
               <div className="h-6 w-full bg-white/5 animate-pulse rounded"></div>
            ) : data?.objectSpecs ? (
              <>
                <div>
                   <span className="block text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Edition</span>
                   <span className="text-sm font-medium text-white tracking-wide">{data.objectSpecs.edition}</span>
                </div>
                <div>
                   <span className="block text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Format</span>
                   <span className="text-sm font-medium text-white tracking-wide">{data.objectSpecs.format}</span>
                </div>
                <div>
                   <span className="block text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Dimensions</span>
                   <span className="text-sm font-medium text-white tracking-wide">{data.objectSpecs.dimensions}</span>
                </div>
                <div>
                   <span className="block text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Acquisition</span>
                   <span className="text-sm font-medium text-white tracking-wide">{data.objectSpecs.price}</span>
                </div>
              </>
            ) : null}
         </div>

         {/* Zone B: Expressive Engagement (Verbs not numbers) */}
         <div className="flex gap-4">
            <button className="flex-1 py-4 px-6 bg-white/5 hover:bg-[#ff3b3f] border border-white/10 hover:border-[#ff3b3f] rounded-xl text-white transition-all group flex items-center justify-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"/></svg>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Respond to Work</span>
            </button>
            <button className="flex-1 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all group flex items-center justify-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Save to Vault</span>
            </button>
            <button className="py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all group">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 group-hover:opacity-100 group-hover:text-[#ff3b3f] group-hover:fill-[#ff3b3f] transition-all"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
         </div>
      </div>
    </div>
  );

  // LAYER 2: CREATOR (Enter the World)
  const renderCreator = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-right-12 duration-700">
       
       {/* Sigil Card */}
       <div className="relative w-full h-64 rounded-[2rem] overflow-hidden mb-8 group shrink-0">
          <img src={`https://picsum.photos/seed/${scene.director.id}_cover/800/400`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110 grayscale mix-blend-multiply opacity-60" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-16 h-16 rounded-full border-2 border-[#ff3b3f] p-1">
                 <img src={scene.director.avatar} className="w-full h-full rounded-full object-cover" alt="Director" />
               </div>
               <div>
                 <h2 className="text-4xl font-black tracking-tighter text-white">{scene.director.name}</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff3b3f]">Member since 2023</p>
               </div>
             </div>
             
             <div className="flex gap-4">
                <span className="px-3 py-1 bg-white/10 rounded-md text-[9px] uppercase tracking-widest text-white/80">Photographer</span>
                <span className="px-3 py-1 bg-white/10 rounded-md text-[9px] uppercase tracking-widest text-white/80">Curator</span>
                <span className="px-3 py-1 bg-white/10 rounded-md text-[9px] uppercase tracking-widest text-white/80">Lagos</span>
             </div>
          </div>
       </div>

       {/* Works Grid */}
       <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Selected Works</h3>
             <span className="text-[9px] font-black uppercase tracking-widest text-[#ff3b3f]">View Full Archive</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="aspect-[4/5] bg-white/5 rounded-xl overflow-hidden relative group cursor-pointer border border-white/5">
                  <img src={`https://picsum.photos/seed/${scene.director.id}_${i}/300/400`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Work" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-[8px] font-black uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">Explore</span>
                  </div>
               </div>
             ))}
          </div>
       </div>

       <button 
         onClick={() => setActiveLayer('OBSERVE')}
         className="mt-4 self-center text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
       >
         Return to Object
       </button>
    </div>
  );

  // LAYER 3: CONTEXT (Meaning Amplification)
  const renderContext = () => (
    <div className="flex flex-col h-full animate-in slide-in-from-bottom-12 duration-700">
       <div className="mb-8 text-center shrink-0">
          <h2 className="text-3xl font-black tracking-tighter mb-2 text-white">Why This Exists</h2>
          <p className="text-[#ff3b3f] text-[9px] font-black uppercase tracking-[0.4em]">Contextual Resonance</p>
       </div>
       
       {/* 3 Pillars of Context */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Pillar 1: Cultural Anchor */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col">
             <div className="w-8 h-8 mb-4 text-[#ff3b3f]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
             </div>
             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">Cultural Anchor</h4>
             <p className="text-sm font-light text-white/90 leading-relaxed">
               {data?.context?.culturalAnchor || "Rooted in the evolving narrative of the West African avant-garde."}
             </p>
          </div>

          {/* Pillar 2: Technical Choice */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col">
             <div className="w-8 h-8 mb-4 text-[#ff3b3f]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
             </div>
             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">Technical Choice</h4>
             <p className="text-sm font-light text-white/90 leading-relaxed">
               {data?.context?.technicalChoice || `Shot on ${scene.metadata?.camera || 'Digital'} to capture the raw texture of the environment.`}
             </p>
          </div>

          {/* Pillar 3: Relevance (Why Now) */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col">
             <div className="w-8 h-8 mb-4 text-[#ff3b3f]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
             </div>
             <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50 mb-3">Why Now</h4>
             <p className="text-sm font-light text-white/90 leading-relaxed">
               {data?.context?.relevance || "A timely reflection on identity in a post-digital age."}
             </p>
          </div>
       </div>

       {/* Sentiment Feedback (Soft Signal) */}
       <div className="mt-8 pt-8 border-t border-white/10 shrink-0">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-white/30 mb-6">How did this land?</p>
          <div className="flex justify-center gap-4">
             {['Moved', 'Inspired', 'Challenged', 'Curious'].map(mood => (
               <button key={mood} className="px-6 py-3 rounded-full border border-white/10 hover:border-[#ff3b3f] hover:bg-[#ff3b3f]/10 text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                 {mood}
               </button>
             ))}
          </div>
       </div>

       <button 
         onClick={() => setActiveLayer('OBSERVE')}
         className="mt-8 self-center text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
       >
         Return to Object
       </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl transition-opacity duration-700 cursor-pointer" 
        onClick={onClose}
      />
      
      <div className="relative liquid-glass w-full max-w-6xl h-[85vh] rounded-[3rem] overflow-hidden p-8 md:p-16 flex flex-col border border-white/10 shadow-[0_0_100px_rgba(255,59,63,0.05)]">
        
        {/* Top Navigation (Layers) */}
        <div className="absolute top-8 left-0 w-full flex justify-center z-20 pointer-events-none">
           <div className="flex bg-black/40 backdrop-blur-md rounded-full p-1.5 pointer-events-auto border border-white/5">
             {['OBSERVE', 'CREATOR', 'CONTEXT'].map((l) => (
               <button 
                 key={l}
                 onClick={() => setActiveLayer(l as any)}
                 className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeLayer === l ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
               >
                 {l}
               </button>
             ))}
           </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 md:top-12 md:right-12 text-white/20 hover:text-[#ff3b3f] transition-colors z-20 p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Main Content Area */}
        <div className="mt-16 h-full min-h-0 relative">
          {activeLayer === 'OBSERVE' && renderObserve()}
          {activeLayer === 'CREATOR' && renderCreator()}
          {activeLayer === 'CONTEXT' && renderContext()}
        </div>
      </div>
    </div>
  );
};

export default OmniMenu;
