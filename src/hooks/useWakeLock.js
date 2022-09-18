import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const available = 'wakeLock' in navigator;
let wakeLock;

const useWakeLock = () => {
  const [enabled, setEnabled] = useLocalStorage('wakelock', available);
  
  useEffect(async () => {
    if (available) {
      if (enabled) {
        wakeLock = await window.navigator.wakeLock.request('screen');
      } else {
        wakeLock?.release();
      }
    }
  }, [enabled]);

  return [available, enabled, setEnabled];
};

export default useWakeLock;