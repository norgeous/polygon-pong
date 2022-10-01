import { useReducer, useEffect } from 'react';

const useData = (peerConnections, dispatchPeerConnection, dataReducer = {}) => {

  const reducer = (state, { type, payload }) => {
    console.log('>>', type, payload.id, payload.data)
    const setStateByKey = (id, data) => ({
      ...state,
      [id]: {
        ...state?.[id],
        ...data,
      },
    });

    return ({
      OPEN: ({ id }) => setStateByKey(id, {
        open: true,
        // data: {},
      }),
      CLOSE: ({ id }) => setStateByKey(id, {
        open: false,
        // data: undefined,
      }),
      DATA: ({ id, data: { type: dType, payload: dPayload }}) => {
        const newData = ({
          ...dataReducer,
          PING: () => {
            console.log('GOT PING, SEND PONG');
            peerConnections[id].send({ type: 'PONG' });
          },
          PONG: () => {
            console.log('GOT PONG');
            const { pingStart } = state[id];
            const rtt = window.performance.now() - pingStart;
            const latency = Math.round(rtt / 2);
            console.log('LATENCY CALC',{state,id,rtt,latency});
            return {
              ping: latency,
              // pingStart: undefined,
            };
          },
        })[dType]?.(id, dPayload);

        const newState = setStateByKey(id, newData);

        return newState || state;
      },
      SAVEDATA: ({ id, data }) => setStateByKey(id, data),
    })[type]?.(payload);
  };

  const [peerData, dispatchPeerData] = useReducer(reducer, {});

  // if peerConnections changes (both INCOMING and OUTGOING), register handlers
  useEffect(() => {
    Object.values(peerConnections).forEach(dataConnection => {
      // Emitted when the connection is established and ready-to-use
      dataConnection.on('open', () => {
        dataConnection.send({ type: 'GREETING' });
        dispatchPeerData({ type: 'OPEN', payload: { id: dataConnection.peer } });
      });

      // Emitted when either you or the remote peer closes the data connection (firefox not supported)
      dataConnection.on('close', () => {
        dispatchPeerConnection({ type: 'REMOVE', payload: { id: dataConnection.peer } });
        dispatchPeerData({ type: 'CLOSE', payload: { id: dataConnection.peer } });
      });

      // Emitted when data is received from the remote peer
      dataConnection.on('data', data => dispatchPeerData({ type: 'DATA', payload: { id: dataConnection.peer, data } }));
    });

    // teardown
    return () => {
      Object.values(peerConnections).forEach(dataConnection => {
        dataConnection.off('open');
        dataConnection.off('close');
        dataConnection.off('data');
      });
    };
  }, [peerConnections]);

  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      console.log('pingEm')
      Object.values(peerConnections) 
        .filter(dataConnection => dataConnection.open)
        .forEach(dataConnection => {
          console.log('SEND PING to ',dataConnection);
          dispatchPeerData({
            type: 'SAVEDATA',
            payload: {
              id: dataConnection.peer,
              data:{
                pingStart: window.performance.now(),
              },
            },
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