import { useState, useEffect } from 'react';

const available = 'getBattery' in navigator;

const useBattery = () => {
  const [batteryPercent, setBatteryPercent] = useState(100);

  useEffect(() => {
    if (available) {
      const getBattery = async () => {
        const newBattery = await navigator.getBattery();
        setBatteryPercent(Math.floor(newBattery.level * 100));
      };

      getBattery();
      
      const t = setInterval(getBattery, 10 * 1000); // poll every 10 seconds
      
      return () => clearInterval(t);
    }
  }, []);

  return [available, batteryPercent];
};

export default useBattery;
