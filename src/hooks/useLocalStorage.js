import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  const [value, setValue] = useState(item && JSON.parse(item) || defaultValue);

  // update local storage when value changes
  useEffect(() => {
    if (value) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;
