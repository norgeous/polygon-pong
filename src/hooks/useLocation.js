import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useLocation = () => {
  const [location, setLocation] = useLocalStorage('location');

  useEffect(async () => {
    if (!location) {
      fetch('https://ipwho.is/?fields=country_code,city,postal')
        .then(res => res.json())
        .then(res => {
          setLocation(res);
        });
    }
  }, []);

  return location;
};

export default useLocation;
