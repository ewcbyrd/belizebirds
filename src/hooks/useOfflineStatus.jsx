import { useState, useEffect } from 'react';

/**
 * useOfflineStatus Hook
 * Detects online/offline status and tracks last sync time
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Handle online/offline events
    const handleOnline = () => {
      console.log('[Offline Status] Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Offline Status] Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Load last sync time from localStorage
    const stored = localStorage.getItem('lastSyncTime');
    if (stored) {
      setLastSyncTime(stored);
    }
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    lastSyncTime,
    setLastSyncTime: (time) => {
      setLastSyncTime(time);
      localStorage.setItem('lastSyncTime', time);
    },
  };
}
