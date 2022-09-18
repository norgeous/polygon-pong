const os = {
  default: '👨‍💻',
  linux: '🐧',
  windows: '🪟',
  macos: '🍏',
  ios: '🍎',
  android: '🤖',
};

const browser = {
  default: '🌐',
  chrome: '🌎',
  firefox: '🦊',
  'android browser': '🤖',
  opera: '🅾️',
  safari: '🦓',
  'microsoft edge': '🗺️',
  ie: '💩',
};

const ui = {
  default: '?',
  game: '🕹️',
  settings: '⚙️',
  reload: '♻️',
  reset: '🌀',
  info: 'ℹ️',
  multiplayer: '👬',
  network: '🙎',
  toolbox: '🧰',
  battery_full: '🔋',
  battery_half: '🪫',
  connected: '✅',
  disconnected: '🚷',
  self: '🏠', //'🫵',
  host: '👑',
};

const game = {
  default: '?',
  heart_on: '❤️',
  heart_off: '🖤',
  bomb: '💣',
  boom: '💥',
  gem: '💎',
  coin: '🪙',
};

const volume = '🔇,🔈,🔉,🔊,📣'.split(',');

const clock = '🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛'.split('');

const intlLetters = {
  A: '🇦',
  B: '🇧',
  C: '🇨',
  D: '🇩',
  E: '🇪',
  F: '🇫',
  G: '🇬',
  H: '🇭',
  I: '🇮',
  J: '🇯',
  K: '🇰',
  L: '🇱',
  M: '🇲',
  N: '🇳',
  O: '🇴',
  P: '🇵',
  Q: '🇶',
  R: '🇷',
  S: '🇸',
  T: '🇹',
  U: '🇺',
  V: '🇻',
  W: '🇼',
  X: '🇽',
  Y: '🇾',
  Z: '🇿',
  joiner: '\u200d',
};

export const getOsIcon = name => os[name.toLowerCase()] || os.default;
export const getBrowserIcon = name => browser[name.toLowerCase()] || browser.default;
export const getUiIcon = name => ui[name.toLowerCase()] || ui.default;
export const getGameIcon = name => game[name.toLowerCase()] || game.default;
export const getVolumeIcon = v => {
  if (v <= 0) return volume[0];
  if (v > 0.00 && v <= 0.33) return volume[1];
  if (v > 0.33 && v <= 0.66) return volume[2];
  if (v > 0.66 && v <= 0.99) return volume[3];
  if (v >= 1) return volume[4];
};
export const getClockIcon = i => clock[i-1] || clock[11];
export const getFlagIcon = countryCode => countryCode
  ?.split('')
  .map(letter => intlLetters[letter])
  .join(intlLetters.joiner) || null;
