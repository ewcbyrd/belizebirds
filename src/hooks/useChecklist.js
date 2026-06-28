import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'belizebirds-checklist';

const loadSeenSlugs = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    return new Set(JSON.parse(stored));
  } catch {
    return new Set();
  }
};

export const useChecklist = () => {
  const [seenSlugs, setSeenSlugs] = useState(loadSeenSlugs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seenSlugs]));
  }, [seenSlugs]);

  const isSeen = useCallback(
    (slug) => seenSlugs.has(slug),
    [seenSlugs]
  );

  const toggleSeen = useCallback((slug) => {
    setSeenSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const clearChecklist = useCallback(() => {
    setSeenSlugs(new Set());
  }, []);

  return {
    isSeen,
    toggleSeen,
    seenCount: seenSlugs.size,
    clearChecklist,
  };
};
