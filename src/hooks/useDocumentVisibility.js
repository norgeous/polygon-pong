import { useState, useEffect } from 'react';

const useDocumentVisibility = () => {
  const [visibilityState, setVisibilityState] = useState('visible');

  useEffect(() => {
    document.addEventListener('visibilitychange', () => setVisibilityState(document.visibilityState));
  }, []);

  return visibilityState;
};

export default useDocumentVisibility;
