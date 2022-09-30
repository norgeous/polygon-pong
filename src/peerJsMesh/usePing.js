import { useState, useReducer, useEffect, useMemo, useCallback } from 'react';

const usePing = (peerConnections) => {
  const [pings, setPings] = useState({});
  
  
  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      Object.values(peerConnections) 
        .filter(dataConnection => dataConnection.open)
        .forEach(dataConnection => {
          dispatchPeerData({
            type: 'SAVEDATA',
            payload: { id: dataConnection.peer, data:{pingStart: window.performance.now()} },
          });
          dataConnection.send({ action: 'PING' });
        });
    };
    const t = setInterval(pingEm, 10000);
    return () => clearInterval(t);
  }, [peerConnections]);

  return {
    pings,
  };
};

export default usePing;