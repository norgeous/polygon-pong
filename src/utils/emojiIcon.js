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

export const getOsIcon = name => os[name.toLowerCase()] || os.default;
export const getBrowserIcon = name => browser[name.toLowerCase()] || browser.default;
