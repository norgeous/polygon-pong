import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useLocation = () => {
  const [location, setLocation] = useLocalStorage('location');

  useEffect(async () => {
    const now = new Date().getTime();
    const expiryPeriod = 1000 * 60 * 60 * 24 * 1; // rate limit 1 per day
    if (!location || location.expires < now) {
      fetch('https://ipwho.is/?fields=country_code,city,postal')
        .then(res => res.json())
        .then(res => {
          setLocation({
            expires: now + expiryPeriod,
            data: {
              countryCode: res.country_code,
              city: res.city,
              postal: res.postal,
            }
          });
        });
    }
  }, []);

  return location?.data;
};

export default useLocation;
