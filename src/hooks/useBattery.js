import { useState, useEffect } from 'react';

const available = 'getBattery' in navigator;

const useBattery = () => {
  const [battery, setBattery] = useState();

  useEffect(() => {
    if (available) {
      const getBattery = async () => {
        const newBattery = await navigator.getBattery();
        setBattery(newBattery);
      };

      getBattery();
      
      const t = setInterval(getBattery, 10 * 1000); // poll every 10 seconds
      
      return () => clearInterval(t);
    }
  }, []);

  const batteryPercent = `${Math.floor((battery?.level || 0) * 100)}%`;

  return [available, batteryPercent];
};

export default useBattery;
