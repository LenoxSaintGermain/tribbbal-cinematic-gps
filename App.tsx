
import React, { useState, useEffect } from 'react';
import Portal from './components/Portal';
import NarrativeEngine from './components/NarrativeEngine';
import LiquidConductor from './components/LiquidConductor';
import OmniPanel from './components/OmniPanel';
import { Scene, WorldID, JourneyState } from './types';
import { useIntentSignal } from './hooks/useIntentSignal';

const INITIAL_SCENES: Scene[] = [
  {
    id: 'sc1',
    modality: 'film',
    world: 'WATCH',
    director: { 
      id: 'd1', name: 'Malick Sidibé Jr.', handle: '@malick_film', 
      avatar: 'https://picsum.photos/seed/malick/100', isOnline: true,
      role: 'Director', city: 'Bamako' 
    },
    narrative: 'A study of movement in the Sahel. Transcending the boundaries of traditional West African cinema.',
    mediaUrl: 'https://cdn.midjourney.com/video/2fe1d0d0-1dfa-46a4-b6cc-70286f777e8f/1.mp4',
    mediaType: 'video',
    timestamp: '2h ago',
    vibe: 'Contemplative Noir',
    pacing: 'medium',
    tone: 'Cinematic Depth',
    primaryEmotion: 'Nostalgia',
    cinematicIntent: 'To capture the fluid grace of everyday life against the arid backdrop.',
    type: 'motion',
    metadata: { location: 'Bamako, Mali', score: 'Ali Farka Touré - Savane', camera: 'Sony Venice 2' }
  },
  {
    id: 'sc2',
    modality: 'video',
    world: 'WATCH',
    director: { 
      id: 'd2', name: 'Temsi Olowu', handle: '@temsi_vis', 
      avatar: 'https://picsum.photos/seed/temsi/100', isOnline: true,
      role: 'Creative Producer', city: 'London' 
    },
    narrative: 'The "Eko Shift" documentary. Exploring the kinetic energy of the Lagos underground fashion circuit.',
    mediaUrl: 'https://cdn.midjourney.com/video/0c954bd0-b0e6-438f-b199-b7781aba8d71/2.mp4',
    mediaType: 'video',
    timestamp: 'Just now',
    vibe: 'Kinetic Energy',
    pacing: 'fast',
    tone: 'Hyper-Modern',
    primaryEmotion: 'Excitement',
    cinematicIntent: 'Highlighting the raw, unpolished beauty of subcultural defiance.',
    type: 'motion',
    metadata: { location: 'London, UK', score: 'Temsi - Shift (Radio Edit)', camera: 'Arri Alexa 35' }
  },
  {
    id: 'sc3',
    modality: 'photo',
    world: 'COLLECT',
    director: { 
      id: 'd3', name: 'Imaan Hammam', handle: '@imaan_lens', 
      avatar: 'https://picsum.photos/seed/imaan/100', isOnline: false,
      role: 'Photographer', city: 'Cairo' 
    },
    narrative: 'Editorial series: The Desert Queen. A silent dialogue between fabric and dunes.',
    mediaUrl: 'https://cdn.midjourney.com/caa14a21-3713-4359-8605-058b75ac0f58/0_0.png',
    mediaType: 'image',
    timestamp: '5h ago',
    vibe: 'Slow Luxury',
    pacing: 'slow',
    tone: 'Editorial',
    primaryEmotion: 'Serenity',
    cinematicIntent: 'Freezing a moment of high-fashion elegance in the timeless desert.',
    type: 'stills',
    metadata: { location: 'Cairo, EG', camera: 'Hasselblad H6D' }
  },
  {
    id: 'sc4',
    modality: 'photo',
    world: 'BUILD',
    director: { 
      id: 'd4', name: 'Sir David Adjaye', handle: '@adjaye_arch', 
      avatar: 'https://picsum.photos/seed/david/100', isOnline: true,
      role: 'Architect', city: 'Accra' 
    },
    narrative: 'The National Cathedral. A convergence of faith, heritage, and modern structural language.',
    mediaUrl: 'https://cdn.midjourney.com/video/53e80c15-9bb6-4279-98e5-b682b3aa6240/2.mp4',
    mediaType: 'video',
    timestamp: '1d ago',
    vibe: 'Monumental',
    pacing: 'slow',
    tone: 'Architectural',
    primaryEmotion: 'Awe',
    cinematicIntent: 'Showcasing the interplay of light and shadow in spiritual spaces.',
    type: 'motion',
    metadata: { location: 'Accra, GH', camera: 'DJI Mavic 3 Cine' }
  },
  {
    id: 'sc5',
    modality: 'audio',
    world: 'CREATE',
    director: { 
      id: 'd5', name: 'Sarz', handle: '@sarz_on_beat', 
      avatar: 'https://picsum.photos/seed/sarz/100', isOnline: true,
      role: 'Music Producer', city: 'Lagos' 
    },
    narrative: 'I am Sarz. A new rhythmic frequency from the heart of Lagos. Synthesizing the soul of Afrobeats.',
    mediaUrl: 'https://cdn.midjourney.com/video/e90f6aed-a439-498f-b90a-4b4080aa73bd/3.mp4',
    mediaType: 'video',
    timestamp: 'Just now',
    vibe: 'Vibrant Pulse',
    pacing: 'medium',
    tone: 'Sonic',
    primaryEmotion: 'Energy',
    cinematicIntent: 'Visualizing the pulse of a new track through atmospheric studio fragments.',
    type: 'motion',
    metadata: { location: 'Lagos, NG', score: 'Sarz - Grid Lock', camera: 'Red Komodo' }
  },
  {
    id: 'sc6',
    modality: 'product',
    world: 'COLLECT',
    director: { 
      id: 'd6', name: 'Enwonwu II', handle: '@enwonwu_arts', 
      avatar: 'https://picsum.photos/seed/enwonwu/100', isOnline: true,
      role: 'Visual Artist', city: 'Benin City' 
    },
    narrative: 'Ancestral Portraits. Hand-drawn pencil and charcoal works exploring the lineage of the Bini Kingdom.',
    mediaUrl: 'https://cdn.midjourney.com/video/2b3e6c74-4a73-48a5-89f5-68d4c937df12/0.mp4',
    mediaType: 'video',
    timestamp: '3d ago',
    vibe: 'Weighty & Precise',
    pacing: 'medium',
    tone: 'Traditional',
    primaryEmotion: 'Pride',
    cinematicIntent: 'Demonstrating the tactile provenance and soul of the charcoal strokes.',
    type: 'motion',
    metadata: { location: 'Benin City, NG', provenance: 'Royal Bini Collection', materials: 'Charcoal, Pencil, Vellum' }
  },
  {
    id: 'sc7',
    modality: 'video',
    world: 'BUILD',
    director: { 
      id: 'd7', name: 'Tribbbal Initiative', handle: '@tribbbal_labs', 
      avatar: 'https://picsum.photos/seed/tribbbal_sys/100', isOnline: true,
      role: 'System Architects', city: 'The Ether' 
    },
    narrative: 'If software is eating the world, then culture deserves better utensils. This is not a feed. It is a cinematic navigation system.',
    mediaUrl: 'https://cdn.midjourney.com/video/2356cef4-cd7d-4291-8895-d37383ed17a2/1.mp4',
    mediaType: 'video',
    timestamp: 'Post-Credits',
    vibe: 'Manifesto',
    pacing: 'slow',
    tone: 'Provocative',
    primaryEmotion: 'Clarity',
    cinematicIntent: 'To dismantle the feed and reconstruct it as a journey of meaning.',
    type: 'motion',
    metadata: { location: 'The Blueprint', score: 'System Audio: On', camera: 'Generative Viewport' }
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'PORTAL' | 'JOURNEY'>('PORTAL');
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [activeWorld, setActiveWorld] = useState<WorldID>('WATCH');
  const [activeIdx, setActiveIdx] = useState(0);
  const [isGPSOpen, setIsGPSOpen] = useState(false);
  const { intent, setIntent, triggerOrienting } = useIntentSignal();

  // Dynamically update journey state based on active scene
  const activeScene = scenes[activeIdx];
  const journey: JourneyState = {
    currentWorld: activeScene.world,
    breadcrumb: ['Home', activeScene.world, activeScene.modality.toUpperCase()],
    activeZoneLabel: `Exploring · ${activeScene.modality.charAt(0).toUpperCase() + activeScene.modality.slice(1)}`
  };

  const enterUniverse = (world: string) => {
    // Mapping portal worlds to our Journey Worlds
    const targetWorld: WorldID = world === 'film' ? 'WATCH' : 
                                 world === 'art' ? 'COLLECT' : 
                                 world === 'music' ? 'CREATE' : 'CONNECT';
    
    // Find first scene of that world if possible
    const firstSceneIdx = scenes.findIndex(s => s.world === targetWorld);
    if (firstSceneIdx !== -1) setActiveIdx(firstSceneIdx);

    setTimeout(() => {
      setView('JOURNEY');
      triggerOrienting();
    }, 1200);
  };

  const addSimulatedScene = (newScene: Scene) => {
    setScenes(prev => [newScene, ...prev]);
    setActiveIdx(0);
    setIntent('ORIENTING');
  };

  const navigateToWorld = (world: WorldID) => {
    const firstInWorld = scenes.findIndex(s => s.world === world);
    if (firstInWorld !== -1) setActiveIdx(firstInWorld);
    
    setIsGPSOpen(false);
    setIntent('CRUISING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        setIntent('ROUTING');
        setIsGPSOpen(true);
      }
      if (e.key === 'Escape') {
        setIsGPSOpen(false);
        setIntent('CRUISING');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIntent]);

  return (
    <div className="h-screen w-full bg-[#050505] overflow-hidden relative">
      {view === 'PORTAL' ? (
        <Portal onEnter={enterUniverse} />
      ) : (
        <NarrativeEngine 
          scenes={scenes} 
          activeIdx={activeIdx} 
          onIdxChange={setActiveIdx}
        />
      )}

      {/* Cinematic GPS Conductor */}
      {view === 'JOURNEY' && (
        <LiquidConductor 
          intent={intent}
          journey={journey}
          onOpenGPS={() => {
            setIntent('ROUTING');
            setIsGPSOpen(true);
          }}
        />
      )}

      {/* Routing Panel */}
      <OmniPanel 
        isOpen={isGPSOpen}
        onClose={() => {
          setIsGPSOpen(false);
          setIntent('CRUISING');
        }}
        activeWorld={activeScene.world}
        onNavigate={navigateToWorld}
        onSceneSimulated={addSimulatedScene}
      />
    </div>
  );
};

export default App;
