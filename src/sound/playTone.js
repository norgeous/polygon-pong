const playTone = ({
  frequency = 261.626, // C4
  type = 'triangle', // or 'sine' or 'square'
  volume = 1,
  delay = 0,
  duration = 0.05,
} = {}) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioCtx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.value = frequency;

  var gainNode = audioCtx.createGain();
  gainNode.gain.value = volume;

  // oscillator -> gainNode -> destination
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(delay);
  oscillator.stop(duration);
};

export default playTone;
