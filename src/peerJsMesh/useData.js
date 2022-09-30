import { useState, useReducer, useEffect, useMemo, useCallback } from 'react';

const useData = (peerConnections, dispatchPeerConnection, dataReducer = {}) => {

  const [peerData, dispatchPeerData] = useReducer((state, { type, payload }) => {
    // console.log(type);
    const setStateByKey = (id, data) => ({
      ...state,
      [id]: {
        ...state[id],
        ...data,
      },
    });

    return ({
      OPEN: ({ id }) => setStateByKey(id, {
        open: true,
        data: {},
      }),
      DATA: ({ id, data: { type: dType, payload: dPayload }}) => {
        const newState = ({
          GREETING: () => console.log('GOT GREETING from', id),
          PING: () => peerConnections[id].send({ type: 'PONG' }),
          P0NG: () => setStateByKey(id, {
            ping: 0,
          }),
        })[dType]?.(dPayload);

        dataReducer[dType]?.(dPayload);

        console.log('>>>>>>>>>>>>>>>>>..', newState, state);

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
      // console.log('adding handlers to', dataConnection);
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

  return peerData;
};

export default useData;