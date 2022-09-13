import { useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || defaultValue);

  const setValueLocalStorage = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [value, setValueLocalStorage];
};

export default useLocalStorage;
