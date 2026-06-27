/**
 * Cache Manager Utility
 * Handles IndexedDB storage for bird data and cache versioning
 */

const DB_NAME = 'belizebirds';
const DB_VERSION = 1;
const STORE_NAME = 'birds';
const CACHE_KEY = 'birdsCache';
const LAST_SYNC_KEY = 'lastSync';
const VERSION_KEY = 'cacheVersion';

class CacheManager {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize IndexedDB database
   */
  async init() {
    if (this.isInitialized) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('[CacheManager] Failed to open IndexedDB');
        reject(request.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve(this.db);
      };
    });
  }

  /**
   * Get data from IndexedDB
   */
  async get(key) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Set data in IndexedDB
   */
  async set(key, value) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Get cached birds data
   */
  async getCachedBirds() {
    try {
      return await this.get(CACHE_KEY);
    } catch (error) {
      console.error('[CacheManager] Error getting cached birds:', error);
      return null;
    }
  }

  /**
   * Cache birds data
   */
  async cacheBirds(birdsData) {
    try {
      await this.set(CACHE_KEY, birdsData);
      await this.set(LAST_SYNC_KEY, new Date().toISOString());
      console.log('[CacheManager] Birds data cached successfully');
    } catch (error) {
      console.error('[CacheManager] Error caching birds:', error);
    }
  }

  /**
   * Get last sync timestamp
   */
  async getLastSync() {
    try {
      return await this.get(LAST_SYNC_KEY);
    } catch (error) {
      console.error('[CacheManager] Error getting last sync:', error);
      return null;
    }
  }

  /**
   * Check if cache is valid (not stale)
   */
  async isCacheValid() {
    try {
      const lastSync = await this.getLastSync();
      if (!lastSync) return false;

      // Cache is valid for 24 hours
      const lastSyncTime = new Date(lastSync).getTime();
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      return now - lastSyncTime < twentyFourHours;
    } catch (error) {
      console.error('[CacheManager] Error checking cache validity:', error);
      return false;
    }
  }

  /**
   * Clear all cached data
   */
  async clearCache() {
    try {
      if (!this.db) await this.init();

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          console.log('[CacheManager] Cache cleared');
          resolve();
        };
      });
    } catch (error) {
      console.error('[CacheManager] Error clearing cache:', error);
    }
  }

  /**
   * Get formatted last sync time for UI display
   */
  async getFormattedLastSync() {
    try {
      const lastSync = await this.getLastSync();
      if (!lastSync) return null;

      const date = new Date(lastSync);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (error) {
      console.error('[CacheManager] Error formatting last sync:', error);
      return null;
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();
