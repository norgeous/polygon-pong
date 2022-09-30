import { useState, useReducer, useEffect, useMemo, useCallback } from 'react';

const usePing = (peerConnections) => {
  const [pings, setPings] = useState({});



  return {
    pings,
  };
};

export default usePing;