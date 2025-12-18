
import React from 'react';

export type WorldID = 'WATCH' | 'CREATE' | 'COLLECT' | 'CONNECT' | 'BUILD';
export type Modality = 'film' | 'video' | 'photo' | 'audio' | 'product';
export type Pacing = 'slow' | 'medium' | 'fast';

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  handle: string;
  role?: string;
  city?: string;
}

export interface Scene {
  id: string;
  modality: Modality;
  world: WorldID;
  director: User;
  narrative: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: string;
  vibe: string;
  pacing: Pacing;
  tone: string;
  primaryEmotion: string;
  cinematicIntent: string;
  type: 'stills' | 'motion' | 'drop';
  metadata?: {
    location?: string;
    score?: string;
    camera?: string;
    provenance?: string;
    materials?: string;
    collaborators?: string[];
  };
}

export interface ForwardPath {
  id: string;
  label: string;
  description: string;
  onSelect: () => void;
  icon?: React.ReactNode;
}

export interface JourneyState {
  currentWorld: WorldID;
  breadcrumb: string[];
  activeZoneLabel: string;
}

export interface NavAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  type: 'artwork' | 'event' | 'thought' | 'stills' | 'motion' | 'drop';
  price?: string;
  location?: string;
}

export interface ChatSession {
  user: User;
}
