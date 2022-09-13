const emoji = {
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

const FlagEmoji = ({ countryCode }) => countryCode
  ?.split('')
  .map(letter => emoji[letter])
  .join(emoji.joiner) || null;

export default FlagEmoji;
