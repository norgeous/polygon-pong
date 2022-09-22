import { useEffect } from 'react';
import useDocumentVisibility from './useDocumentVisibility';
import useLocalStorage from './useLocalStorage';

const available = 'wakeLock' in navigator;
let wakeLock;

const useWakeLock = () => {
  const visibilityState = useDocumentVisibility();
  const [enabled, setEnabled] = useLocalStorage('wakelock', available);
  
  useEffect(async () => {
    if (available) {
      if (enabled && visibilityState === 'visible') {
        wakeLock = await window.navigator.wakeLock.request('screen');
      } else {
        wakeLock?.release();
      }
    }
  }, [enabled, visibilityState]);

  return [available, enabled, setEnabled];
};

export default useWakeLock;