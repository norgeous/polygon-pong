import { useReducer, useEffect } from 'react';

const useData = (peerConnections, dispatchPeerConnection, dataReducer = {}) => {

  const [peerData, dispatchPeerData] = useReducer((state, { type, payload }) => {
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
        data: {},
      }),
      DATA: ({ id, data: { type: dType, payload: dPayload }}) => {
        const newData = ({
          ...dataReducer,
          PING: () => {
            peerConnections[id].send({ type: 'PONG' });
          },
          PONG: () => {
            const { pingStart } = state[id];
            const rtt = window.performance.now() - pingStart;
            return {
              ping: rtt / 2,
              pingStart: undefined,
            };
          },
        })[dType]?.(id, dPayload);

        const newState = setStateByKey(id, newData);

        return newState || state;
      },
      CLOSE: ({ id }) => setStateByKey(id, {
        open: false,
        data: undefined,
      }),
      SAVEDATA: ({ id, data }) => setStateByKey(id, data),
    })[type]?.(payload);
  }, {});

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
  }, [peerConnections]);

  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      Object.values(peerConnections) 
        .filter(dataConnection => dataConnection.open)
        .forEach(dataConnection => {
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
    const t = setInterval(pingEm, 10000);
    return () => clearInterval(t);
  }, [peerConnections]);

  return peerData;
};

export default useData;