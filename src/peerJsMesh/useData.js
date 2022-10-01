import { useReducer, useState, useEffect } from 'react';

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

  // const actionReducer = ({ type, payload }) => {
  //   console.log('>>', type, payload);

  //   return ({
  //     OPEN: ({ id }) => ,
  //     CLOSE: ({ id }) => ,
  //     DATA: ({ id, data: { type: dType, payload: dPayload }}) => {
  //       const newData = ;

  //       const newState = setStateByKey(id, newData);

  //       return newState || state;
  //     },
  //     SAVEDATA: ({ id, data }) => setPeerDataById(id, data),
  //   })[type]?.(payload);
  // };

  // const [peerData, dispatchPeerData] = useReducer(reducer, {});



  // if peerConnections changes (both INCOMING and OUTGOING), register handlers
  useEffect(() => {
    Object.values(peerConnections).forEach(dataConnection => {
      const id = dataConnection.peer;

      // Emitted when the connection is established and ready-to-use
      dataConnection.on('open', () => {
        dataConnection.send({ type: 'GREETING' });
        setPeerDataById(id, { open: true });
      });

      // Emitted when either you or the remote peer closes the data connection (firefox not supported)
      dataConnection.on('close', () => {
        dispatchPeerConnection({ type: 'REMOVE', payload: { id } });
        setPeerDataById(id, { open: false });
      });

      // Emitted when data is received from the remote peer
      dataConnection.on('data', ({ type, payload }) => {
        ({
          ...dataReducer,
          PING: () => {
            console.log('GOT PING, SEND PONG');
            peerConnections[id].send({ type: 'PONG' });
          },
          PONG: () => {
            console.log('GOT PONG');
            const { pingStart } = peerData[id];
            const rtt = window.performance.now() - pingStart;
            const latency = Math.round(rtt / 2);
            console.log('LATENCY CALC',{id,rtt,latency});
            setPeerDataById(id, {
              ping: latency,
              pingStart: undefined,
            });
          },
        })[type]?.(id, payload);
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
  }, [peerConnections, peerData]);

  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      console.log('pingEm')
      Object.values(peerConnections) 
        .filter(dataConnection => dataConnection.open)
        .forEach(dataConnection => {
          console.log('SEND PING to ',dataConnection.peer);
          setPeerDataById(dataConnection.peer, {
            pingStart: window.performance.now(),
          });
          dataConnection.send({ type: 'PING' });
        });
    };
    console.log('setInterval');
    const t = setInterval(pingEm, 10000);
    return () => {
      console.log('clearInterval');
      clearInterval(t);
    };
  }, [peerConnections]);

  return peerData;
};

export default useData;