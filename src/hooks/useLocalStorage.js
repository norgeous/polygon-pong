import { useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(JSON.parse(localStorage.getItem(key)) || defaultValue);

  const setValueLocalStorage = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setValueLocalStorage];
};

export default useLocalStorage;
