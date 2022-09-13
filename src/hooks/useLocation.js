import { useState, useEffect } from 'react';

const useLocation = () => {
  const [countryCode, setCountryCode] = useState();

  useEffect(async () => {
    fetch('http://ip-api.com/json/?fields=countryCode')
      .then(res => res.json())
      .then(res => {
        setCountryCode(res.countryCode);
      });
  }, []);

  return countryCode;
};

export default useLocation;
