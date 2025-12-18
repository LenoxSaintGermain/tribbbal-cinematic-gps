
import React from 'react';
import { IntentState } from '../hooks/useIntentSignal';
import { JourneyState } from '../types';

interface LiquidConductorProps {
  intent: IntentState;
  journey: JourneyState;
  onOpenGPS: () => void;
}

const LiquidConductor: React.FC<LiquidConductorProps> = ({ 
  intent, 
  journey, 
  onOpenGPS 
}) => {
  const isRouting = intent === 'ROUTING';
  const isOrienting = intent === 'ORIENTING';
  const isCruising = intent === 'CRUISING';

  return (
    <div 
      className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[120] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCruising ? 'opacity-20 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <div 
        onClick={onOpenGPS}
        className={`liquid-glass liquid-glow shimmer-sweep px-8 py-3 rounded-full flex items-center gap-6 cursor-pointer group transition-all duration-700 ${
          isOrienting ? 'scale-100' : 'scale-95'
        } ${isRouting ? 'opacity-0 scale-110' : 'opacity-100'}`}
      >
        {/* Current Zone Label (Always visible in Conductor) */}
        <div className="flex flex-col items-start min-w-[120px]">
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[#ff3b3f] mb-0.5 animate-pulse">
            {isCruising ? 'Observing' : 'Orienting'}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
            {journey.activeZoneLabel}
          </span>
        </div>

        {/* Breadcrumb - Only visible when Orienting */}
        <div className={`flex items-center gap-3 transition-all duration-700 ${isOrienting ? 'w-auto opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 pointer-events-none overflow-hidden'}`}>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          {journey.breadcrumb.map((step, idx) => (
            <React.Fragment key={idx}>
              <span className="text-[9px] font-medium text-white/40 uppercase tracking-widest">{step}</span>
              {idx < journey.breadcrumb.length - 1 && (
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/20"><path d="m9 18 6-6-6-6"/></svg>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* GPS Indicator */}
        <div className="ml-2 w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[#ff3b3f] transition-all group-hover:border-[#ff3b3f]/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
      </div>
      
      {/* Intent UI Hint */}
      <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-1000 ${isOrienting ? 'opacity-40' : 'opacity-0'}`}>
        <span className="text-[7px] font-black uppercase tracking-[0.4em]">Tap to Routing</span>
      </div>
    </div>
  );
};

export default LiquidConductor;
