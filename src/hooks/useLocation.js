import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useLocation = () => {
  const [location, setLocation] = useLocalStorage('location');

  useEffect(async () => {
    const now = new Date().getTime();
    const expiryPeriod = 1000 * 60 * 60 * 24 * 1; // rate limit 1 per day
    if (!location || location.timestamp + expiryPeriod < now) {
      fetch('https://ipwho.is/?fields=country_code,city,postal')
        .then(res => res.json())
        .then(res => {
          setLocation({
            timestamp: now,
            ...res,
          });
        });
    }
  }, []);

  return location;
};

export default useLocation;
