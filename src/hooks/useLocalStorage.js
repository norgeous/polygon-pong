import { useState, useEffect } from 'react';

const getInitialState = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (item !== undefined) return JSON.parse(item);
  return defaultValue;
};

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(getInitialState(key, defaultValue));

  // update local storage when value changes
  useEffect(() => {
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;
