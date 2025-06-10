import {useCallback, useEffect, useRef, useState} from 'react';
import {fetchProgress, ProgressData} from '../fetchProgress';

const POLLING_INTERVAL = 3000;

export function usePolling() {
  const pollingsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());
  const activePollingIds = Array.from(pollingsRef.current.keys());
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  async function polling(id: string) {
    const result = await fetchProgress(id);

    if (pollingsRef.current.has(id)) {
      setProgressData(prev => {
        const filtered = prev.filter(x => x.id !== id);
        return [...filtered, result];
      });
    }
  }

  const startPolling = useCallback((id: string) => {
    if (pollingsRef.current.has(id)) {
      console.log(`startPolling for ${id}... [skip]`);
      return;
    }

    console.log(`startPolling for ${id}...`);

    polling(id);

    const interval = setInterval(() => polling(id), POLLING_INTERVAL);
    pollingsRef.current.set(id, interval);
  }, []);

  const stopPolling = useCallback((id: string) => {
    if (pollingsRef.current.has(id)) {
      clearInterval(pollingsRef.current.get(id));
      pollingsRef.current.delete(id);

      // filter out from progressData
      setProgressData(prev => prev.filter(x => x.id !== id));

      console.log(`stopPolling for ${id}...`);
    }
  }, []);

  const current = pollingsRef.current;
  useEffect(() => {
    return () => {
      const intervalIds = Array.from(current.values());
      console.log('cleanup...:', intervalIds);
      for (const intervalId of intervalIds) {
        window.clearInterval(intervalId);
      }

      pollingsRef.current = new Map();
    };
  }, []);

  return {
    startPolling,
    stopPolling,
    progressData,
    activePollingIds,
  };
}
