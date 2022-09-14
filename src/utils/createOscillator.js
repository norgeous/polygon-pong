const createAudioContext = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // oscillator -> gainNode -> destination
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.value = 0;
  oscillator.start();

  return { audioCtx, oscillator, gainNode };
};

const createOscillator = () => {
  let context;

  return ({
    frequency = 261.626, // C4
    type = 'triangle', // or 'sine' or 'square'
    volume = 1,
    maxVolume = 1,
    delay = 0,
    duration,
  } = {}) => {
    if (!context || context.audioCtx.state === 'suspended') context = createAudioContext();
  
    const { audioCtx, oscillator, gainNode } = context;

    const absoluteMax = 0.1;
    const normalMax = volume > absoluteMax ? absoluteMax : volume;
    const normalised = normalMax * maxVolume;
    const logVolume = (Math.pow(10, normalised) - 1) / (10-1); // logarithmic volume

    oscillator.type = type;
    gainNode.gain.value = logVolume;
    oscillator.frequency.cancelScheduledValues(audioCtx.currentTime + delay); // cancel overlapping
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay); // mute after duration
    if (duration) {
      oscillator.frequency.setValueAtTime(0, audioCtx.currentTime + delay + duration); // mute after duration
    }
  };
};

export default createOscillator;
