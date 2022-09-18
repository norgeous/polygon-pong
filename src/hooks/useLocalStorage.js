import { useState, useEffect } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  const initialState = item !== undefined && JSON.parse(item) || defaultValue;
  const [value, setValue] = useState(initialState);

  // update local storage when value changes
  useEffect(() => {
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
  }, [value]);

  return [value, setValue];
};

export default useLocalStorage;
