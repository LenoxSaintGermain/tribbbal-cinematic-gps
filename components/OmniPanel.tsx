
import React, { useState } from 'react';
import { simulateCinematicScene } from '../services/geminiService';
import { Scene, WorldID, ForwardPath } from '../types';

interface OmniPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeWorld: WorldID;
  onNavigate: (world: WorldID) => void;
  onSceneSimulated: (scene: Scene) => void;
}

const OmniPanel: React.FC<OmniPanelProps> = ({ 
  isOpen, 
  onClose, 
  activeWorld, 
  onNavigate,
  onSceneSimulated 
}) => {
  const [manifesting, setManifesting] = useState(false);
  const [manifestPrompt, setManifestPrompt] = useState('');

  if (!isOpen) return null;

  // Cinematic GPS Paths based on World Context
  const getForwardPaths = (): ForwardPath[] => {
    switch (activeWorld) {
      case 'WATCH':
        return [
          { id: 'SEQ', label: 'Continue the Sequence', description: 'Deepen the immersion with related threads', onSelect: onClose },
          { id: 'CREATE', label: 'Enter Creation', description: 'Step into the studio and manifest a new scene', onSelect: () => onNavigate('CREATE') },
          { id: 'COLLECT', label: 'Acquire Memory', description: 'Preserve this moment in your private vault', onSelect: () => onNavigate('COLLECT') },
        ];
      case 'CREATE':
        return [
          { id: 'BUILD', label: 'Direct the Future', description: 'Access advanced world-building tools', onSelect: () => onNavigate('BUILD') },
          { id: 'WATCH', label: 'Return to Observation', description: 'Observe the flow of current transmissions', onSelect: () => onNavigate('WATCH') },
        ];
      default:
        return [
          { id: 'WATCH', label: 'Return to Threshold', description: 'Find a new lens into the universe', onSelect: () => onNavigate('WATCH') },
        ];
    }
  };

  const handleManifest = async () => {
    if (!manifestPrompt.trim()) return;
    setManifesting(true);
    const newScene = await simulateCinematicScene(manifestPrompt);
    if (newScene) {
      onSceneSimulated(newScene);
      onClose();
    }
    setManifesting(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative liquid-glass w-full max-w-2xl rounded-[3rem] overflow-hidden p-12 animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center border border-white/5">
        
        <div className="mb-12 text-center">
           <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ff3b3f] mb-4">Routing / {activeWorld}</h4>
           <h2 className="text-4xl font-black tracking-tighter text-white">Define Your Path</h2>
        </div>

        <div className="w-full flex flex-col gap-4 mb-12">
          {getForwardPaths().map((path) => (
            <button
              key={path.id}
              onClick={path.onSelect}
              className="group w-full flex flex-col items-start gap-1 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-[#ff3b3f]/30 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-[#ff3b3f] transition-colors">{path.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/20 group-hover:text-[#ff3b3f] group-hover:translate-x-1 transition-all"><path d="m9 18 6-6-6-6"/></svg>
              </div>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-medium">{path.description}</span>
            </button>
          ))}
        </div>

        {/* Global Action: Manifest */}
        <div className="w-full pt-10 border-t border-white/5 flex flex-col gap-4">
           <div className="relative">
             <input 
               value={manifestPrompt}
               onChange={(e) => setManifestPrompt(e.target.value)}
               placeholder="Manifest a new reality..."
               className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-[#ff3b3f]/50 transition-all"
             />
             <button 
               onClick={handleManifest}
               disabled={manifesting || !manifestPrompt.trim()}
               className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                 manifesting ? 'bg-white/5' : 'bg-[#ff3b3f] hover:scale-105 shadow-lg shadow-[#ff3b3f]/20'
               }`}
             >
               {manifesting ? (
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
               )}
             </button>
           </div>
           
           <div className="flex justify-between items-center px-4">
             <button onClick={onClose} className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Step Back</button>
             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 italic">Cinematic GPS HUD v1.0</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OmniPanel;
