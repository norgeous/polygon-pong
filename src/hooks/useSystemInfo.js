import { useEffect } from 'react';
import Bowser from 'bowser';
import useDocumentVisibility from './useDocumentVisibility';
import useLocalStorage from './useLocalStorage';
import useLocation from './useLocation';
import useBattery from './useBattery';
import useClock from './useClock';
import '../../packageConfig';

const packageConfig = globalThis.packageConfig;

const useSystemInfo = () => {
  const visibilityState = useDocumentVisibility();
  const browser = Bowser.parse(window.navigator.userAgent);
  const cores = navigator.hardwareConcurrency;
  const ram = navigator.deviceMemory;
  const [benchmarks, setBenchmarks] = useLocalStorage('benchmarks', []);
  const location = useLocation();
  const clock = useClock();
  const [batteryAvailable, batteryPercent] = useBattery();

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

  const average = Math.round(benchmarks.reduce((a, b) => a + b, 0) / benchmarks.length);

  return {
    packageConfig,
    visibilityState,
    cores,
    ram,
    hostFitness: average,
    ...browser,
    location,
    batteryAvailable, batteryPercent,
    clock,
    idCard: {
      location,
      osName: browser.os.name,
      platformType: browser.platform.type,
      browserName: browser.browser.name,
      version: packageConfig.version,
      hostFitness: average,
    }
  };
};

export default useSystemInfo;
