const createAudioContext = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // oscillator -> gainNode -> destination
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.frequency.value = 0;
  oscillator.start();

  return { audioCtx, oscillator, gainNode };
};

let context;
const createOscillator = () => {
  return ({
    frequency = 261.626, // C4
    type = 'triangle', // or 'sine' or 'square'
    volume = 1,
    delay = 0,
    duration = 0.05,
  } = {}) => {
    console.log({context});
    if (!context || context.audioCtx.state === 'suspended') context = createAudioContext();
  
    const { audioCtx, oscillator, gainNode } = context;

    oscillator.type = type;
    gainNode.gain.value = volume;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay); // mute after duration
    oscillator.frequency.setValueAtTime(0, audioCtx.currentTime + delay + duration); // mute after duration
  };
};

export default createOscillator;
