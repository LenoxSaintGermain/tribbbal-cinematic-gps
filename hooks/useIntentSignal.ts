
import { useState, useEffect, useRef } from 'react';

export type IntentState = 'CRUISING' | 'ORIENTING' | 'ROUTING';

export function useIntentSignal(timeout: number = 2500) {
  const [intent, setIntent] = useState<IntentState>('CRUISING');
  const timerRef = useRef<number | null>(null);
  const routingTimerRef = useRef<number | null>(null);

  const resetToCruising = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIntent('CRUISING');
    }, timeout);
  };

  useEffect(() => {
    const handleActivity = () => {
      if (intent === 'ROUTING') return; // Don't downgrade if user is routing
      setIntent('ORIENTING');
      resetToCruising();
    };

    const handleStop = () => {
      // If we stop moving after a while, we stay in ORIENTING for a bit
      resetToCruising();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('wheel', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleStop);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('wheel', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleStop);
    };
  }, [intent, timeout]);

  return { 
    intent, 
    setIntent,
    triggerOrienting: () => setIntent('ORIENTING'),
    triggerRouting: () => setIntent('ROUTING'),
    triggerCruising: () => setIntent('CRUISING')
  };
}
