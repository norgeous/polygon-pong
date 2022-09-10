import { useState, useEffect } from 'react';

const useSystemInfo = () => {
  const cores = navigator.hardwareConcurrency;
  const ram = navigator.deviceMemory;
  const [timeTaken, setTimeTaken] = useState(0);

  useEffect(() => {
    const start = new Date().getTime();;
    const data = [...Array(1000000).keys()];
    data.find(x => x == 1000000);
    const end = new Date().getTime();;
    const duration = end - start;
    console.log({start,end});
    setTimeTaken(duration);
  }, []);

  return {
    cores,
    ram,
    timeTaken,
  };
};

export default useSystemInfo;
