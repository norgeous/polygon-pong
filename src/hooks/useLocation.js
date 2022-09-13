import { useState, useEffect } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState();

  useEffect(async () => {
    fetch('https://ipwho.is/?fields=country_code,city,postal')
      .then(res => res.json())
      .then(res => {
        setLocation(res);
      });
  }, []);

  return location;
};

export default useLocation;
