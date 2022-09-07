const useSystemInfo = (game) => {
  const cores = navigator.hardwareConcurrency;
  const ram = navigator.deviceMemory;
  // const fps = game.loop.actualFps;

  return {
    cores,
    ram,
    // fps,
  };
};