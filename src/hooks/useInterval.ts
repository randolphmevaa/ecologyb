// src/hooks/useInterval.ts
import { useRef, useEffect } from 'react';

/**
 * Custom hook for setting up intervals that clean up properly
 * @param callback Function to call on each interval
 * @param delay Delay in milliseconds, or null to pause
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    
    // If delay is null, don't set up an interval
    return undefined;
  }, [delay]);
}