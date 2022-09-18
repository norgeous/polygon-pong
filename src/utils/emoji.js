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
  vol0: '🔇',
  vol1: '🔈',
  vol2: '🔉',
  vol3: '🔊',
  vol4: '📣',
  connected: '✅',
  disconnected: '🚷',
  you: '🏠', //'🫵',
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

const clock = '🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛'.split('');

export const getOsIcon = name => os[name.toLowerCase()] || os.default;
export const getBrowserIcon = name => browser[name.toLowerCase()] || browser.default;
export const getUiIcon = name => ui[name.toLowerCase()] || ui.default;
export const getGameIcon = name => game[name.toLowerCase()] || game.default;
export const getClockIcon = i => clock[i-1] || clock[11];
