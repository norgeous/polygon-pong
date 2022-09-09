import { useState, useEffect } from 'react';

const useClock = () => {
  const [clock, setClock] = useState('00:00');

  useEffect(() => {
    const getClock = () => {
      const now = new Date();
      setClock(new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
      }).format(now));
    };
    getClock();
    const t = setInterval(getClock, 1000);
    return () => clearInterval(t);
  }, []);

  return clock;
};

export default useClock;
