import { useState, useEffect } from 'react';

const useData = (peerConnections, dispatchPeerConnection, dataReducer = {}) => {
  const [peerData, setPeerData] = useState({});
  const setPeerDataById = (id, data) => {
    setPeerData(oldPeerData => ({
      ...oldPeerData,
      [id]: {
        ...oldPeerData[id],
        ...data,
      }
    }));
  };

  // if peerConnections changes (both INCOMING and OUTGOING), register handlers
  useEffect(() => {
    Object.values(peerConnections).forEach(dataConnection => {
      const id = dataConnection.peer;

      // Emitted when the connection is established and ready-to-use
      dataConnection.on('open', () => {
        dataConnection.send({ type: 'GREETING' });
        setPeerDataById(id, {});
      });

      // Emitted when either you or the remote peer closes the data connection (firefox not supported)
      dataConnection.on('close', () => {
        dispatchPeerConnection({ type: 'REMOVE', payload: { id } });
        setPeerData(oldPeerData => Object.fromEntries(Object.entries(oldPeerData).filter(([id]) => id !== dataConnection.peer)));
      });

      // Emitted when data is received from the remote peer
      dataConnection.on('data', ({ type, payload }) => {
        // console.log('Got data >>> ', id, type, payload);
        dataReducer[type]?.({ id, payload, peerData, setPeerDataById });
      });
    });

    // teardown
    return () => {
      Object.values(peerConnections).forEach(dataConnection => {
        dataConnection.off('open');
        dataConnection.off('close');
        dataConnection.off('data');
      });
    };
  }, [peerConnections, peerData, dataReducer]);

  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      // console.log('pingEm');
      Object.values(peerConnections) 
        .filter(dataConnection => dataConnection.open)
        .forEach(dataConnection => {
          // console.log('SEND PING to ',dataConnection.peer);
          setPeerDataById(dataConnection.peer, {
            pingStart: window.performance.now(),
          });
          dataConnection.send({ type: 'PING' });
        });
    };
    // console.log('setInterval');
    const t = setInterval(pingEm, 10000);
    return () => {
      // console.log('clearInterval');
      clearInterval(t);
    };
  }, [peerConnections]);

  return peerData;
};

export default useData;