const game = {
  default: '?',
  heart_on: 'âĪïļ',
  heart_off: 'ðĪ',
  bomb: 'ðĢ',
  boom: 'ðĨ',
  gem: 'ð',
  coin: 'ðŠ',
};

export const ballEmojis = 'ð,ðĢ,ðĨī,ð,ðĪ,ðą,â―,ð,âĢïļ,ðĩ,ðĪŠ,ðĨļ,ðĨđ,ð,ðĐ,ðŦ,ðĪļ,ðŠ,ð,ð,âū,ð,ð,ð'.split(',');

const clock = 'ðððððððððððð'.split('');

const os = {
  default: 'ðĻâðŧ',
  linux: 'ð§',
  windows: 'ðŠ',
  macos: 'ð',
  ios: 'ð',
  android: 'ðĪ',
};

const platform = {
  default: '?',
  mobile: 'ðą',
  desktop: 'ðĨïļ',
};

const browser = {
  default: '?',
  chrome: 'ð',
  firefox: 'ðĶ',
  'android browser': 'ðĪ',
  opera: 'ðūïļ',
  safari: 'ð§­',
  'microsoft edge': 'ð',
  ie: 'ðĐ',
};

const ui = {
  default: '?',
  game: 'ðđïļ',
  settings: 'âïļ',
  reload: 'âŧïļ',
  reset: 'ð',
  info: 'âđïļ',
  multiplayer: 'ðŽ',
  network: 'ð',
  battery_full: 'ð',
  battery_half: 'ðŠŦ',
  connected: 'â',
  disconnected: 'ð·',
  host: 'ð',
  add: 'â',
  remove: 'â',
  about: 'âđïļ',
  pause: 'âļïļ',
  play: 'âķïļ',
  up: 'ðš',
  down: 'ðŧ',
};

const playerTypes = {
  default: 'ðĪ·',
  local: 'ðŦĩ',
  remote: 'ð',
  cpu: 'ðĶū',
};

const volume = 'ð,ð,ð,ð,ðĢ'.split(',');

const intlLetters = {
  A: 'ðĶ',
  B: 'ð§',
  C: 'ðĻ',
  D: 'ðĐ',
  E: 'ðŠ',
  F: 'ðŦ',
  G: 'ðŽ',
  H: 'ð­',
  I: 'ðŪ',
  J: 'ðŊ',
  K: 'ð°',
  L: 'ðą',
  M: 'ðē',
  N: 'ðģ',
  O: 'ðī',
  P: 'ðĩ',
  Q: 'ðķ',
  R: 'ð·',
  S: 'ðļ',
  T: 'ðđ',
  U: 'ðš',
  V: 'ðŧ',
  W: 'ðž',
  X: 'ð―',
  Y: 'ðū',
  Z: 'ðŋ',
  joiner: '\u200d',
};

const times = {
  default: '?',
  sunrise: 'ð', 
  daytime: 'ðïļ', 
  sunset: 'ð', 
  nighttime: 'ð',
};

export const getGameIcon = name => game[name.toLowerCase()] || game.default;
export const getBallIcon = () => ballEmojis[Math.floor(Math.random() * ballEmojis.length)];
export const getClockIcon = i => clock[i-1] || clock[11];
export const getOsIcon = name => os[name.toLowerCase()] || os.default;
export const getPlatformIcon = name => platform[name.toLowerCase()] || platform.default;
export const getBrowserIcon = name => browser[name.toLowerCase()] || browser.default;
export const getPlayerTypeIcon = name => playerTypes[name.toLowerCase()] || playerTypes.default;
export const getUiIcon = name => ui[name.toLowerCase()] || ui.default;
export const getVolumeIcon = v => {
  if (v <= 0) return volume[0];
  if (v > 0.00 && v <= 0.33) return volume[1];
  if (v > 0.33 && v <= 0.66) return volume[2];
  if (v > 0.66 && v <= 0.99) return volume[3];
  if (v >= 1) return volume[4];
};
export const getFlagIcon = countryCode => {
  if (!countryCode) return 'ðīââ ïļ';
  return countryCode
    ?.split('')
    .map(letter => intlLetters[letter])
    .join(intlLetters.joiner) || null;
};

export const getTimeOfDayIcon = timeOfDay => times[timeOfDay.toLowerCase()] || times.default;
