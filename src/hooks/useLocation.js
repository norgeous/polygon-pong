import { useState, useEffect } from 'react';

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

const useLocation = () => {
  const [countryCode, setCountryCode] = useState();

  useEffect(async () => {
    fetch('http://ip-api.com/json/?fields=countryCode')
      .then(res => res.json())
      .then(res => {
        setCountryCode(res.countryCode);
      });
  }, []);

  const flag = countryCode?.split('')
    .map(letter => emoji[letter])
    .join(emoji.joiner);

  return {
    countryCode,
    flag,
  };
};

export default useLocation;
