import { useState, useEffect } from 'react';

const useSystemInfo = () => {
  const cores = navigator.hardwareConcurrency;
  const ram = navigator.deviceMemory;
  const [benchmark, setBenchmark] = useState();
  const [hostFitness, setHostFitness] = useState();

  useEffect(() => {
    const start = window.performance.now();
    const data = [...Array(1000000).keys()];
    data.find(x => x == 1000000);
    const end = window.performance.now();
    const duration = end - start;
    setBenchmark(duration);
    const fitness = ((cores + ram) * 10) - duration;
    console.log({duration, fitness});
    setHostFitness(fitness);
  }, []);

  return {
    cores,
    ram,
    benchmark,
    hostFitness,
  };
};

export default useSystemInfo;
