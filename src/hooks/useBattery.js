import { useState, useEffect } from 'react';

const useBattery = () => {
  const [battery, setBattery] = useState();

  useEffect(() => {
    const getBattery = async () => {
      const newBattery = await navigator.getBattery();
      setBattery(newBattery);
    };
    getBattery();
    const t = setInterval(getBattery, 10*1000);
    return () => clearInterval(t);
  }, []);

  const batteryPercent = Math.round((battery?.level || 0) * 100);

  return batteryPercent;
};

export default useBattery;
