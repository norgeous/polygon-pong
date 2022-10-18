export const formatNumber = (n, zeroPadLength = 0) => new Intl.NumberFormat(navigator.language, { 
  minimumIntegerDigits: zeroPadLength, 
}).format(n);
