import { useState, useEffect } from 'react';
import { useOfflineStatus } from '../hooks/useOfflineStatus';
import { cacheManager } from '../utils/cacheManager';

/**
 * OfflineIndicator Component
 * Displays offline status in bottom-right corner
 * Shows last update time when offline
 */
export default function OfflineIndicator() {
  const { isOffline, lastSyncTime, setLastSyncTime } = useOfflineStatus();
  const [formattedTime, setFormattedTime] = useState(null);
  const [showIndicator, setShowIndicator] = useState(false);

  // Load last sync time from cache manager on mount
  useEffect(() => {
    const loadSyncTime = async () => {
      const syncTime = await cacheManager.getFormattedLastSync();
      if (syncTime) {
        setFormattedTime(syncTime);
        setLastSyncTime(syncTime);
      }
    };
    loadSyncTime();
  }, [setLastSyncTime]);

  // Update formatted time every minute
  useEffect(() => {
    if (!isOffline) {
      setShowIndicator(false);
      return;
    }

    setShowIndicator(true);

    const updateTime = async () => {
      const syncTime = await cacheManager.getFormattedLastSync();
      setFormattedTime(syncTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isOffline]);

  if (!showIndicator) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50"
      role="status"
      aria-live="polite"
      aria-label="Offline status"
    >
      <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M2 11a1 1 0 011-1h2.793l.853-2.56a1 1 0 111.898.632l-.6 1.8h6.112l-.6-1.8a1 1 0 111.898-.632l.853 2.56H15a1 1 0 110 2h-2.793l-.6 1.8a1 1 0 11-1.898-.632l.853-2.56H5.25l.853 2.56a1 1 0 11-1.898.632l-.6-1.8H3a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
      <span>
        Offline
        {formattedTime && ` • Last updated: ${formattedTime}`}
      </span>
    </div>
  );
}
