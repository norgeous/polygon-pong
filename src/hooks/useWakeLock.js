import { useState, useEffect } from "react";

const available = 'wakeLock' in navigator;
let wakeLock;

const useWakeLock = (defaultEnabled) => {
  const [enabled, setEnabled] = useState(defaultEnabled);
  
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