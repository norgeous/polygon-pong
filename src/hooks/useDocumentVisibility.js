import { useState, useEffect } from 'react';

const useDocumentVisibility = () => {
  const [visibilityState, setVisibilityState] = useState(document.visibilityState);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => setVisibilityState(document.visibilityState));
  }, []);

  return visibilityState;
};

export default useDocumentVisibility;
