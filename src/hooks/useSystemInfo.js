import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useSystemInfo = () => {
  // const cores = navigator.hardwareConcurrency;
  // const ram = navigator.deviceMemory;
  // const [benchmark, setBenchmark] = useState();
  // const [hostFitness, setHostFitness] = useState();
  const [benchmarks, setBenchmarks] = useLocalStorage('benchmarks', []);


  useEffect(() => {
    const start = window.performance.now();
    const data = [...Array(1000000).keys()];
    data.find(x => x == 1000000);
    const end = window.performance.now();
    const duration = Math.round(end - start);
    setBenchmarks([
      ...benchmarks,
      duration,
    ].splice(-20));
  }, []);


  // useEffect(() => {
  //   const start = window.performance.now();
  //   const data = [...Array(1000000).keys()];
  //   data.find(x => x == 1000000);
  //   const end = window.performance.now();
  //   const duration = end - start;
  //   setBenchmark(duration);
  //   const fitness = Math.round(((cores + ram) * 10) - duration);
  //   setHostFitness(fitness);
  // }, []);

  const average = Math.round(benchmarks.reduce((a, b) => a + b, 0) / benchmarks.length);

  return {
    // cores,
    // ram,
    // benchmark,
    hostFitness: average,
  };
};

export default useSystemInfo;
