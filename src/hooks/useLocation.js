import { useState, useEffect } from 'react';

const useLocation = () => {
  const [countryCode, setCountryCode] = useState();

  useEffect(async () => {
    fetch('https://ipwho.is/?fields=country_code')
      .then(res => res.json())
      .then(res => {
        setCountryCode(res.country_code);
      });
  }, []);

  return countryCode;
};

export default useLocation;
