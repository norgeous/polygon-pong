import { useState, useReducer, useEffect, useMemo, useCallback } from 'react';
import Peer from 'peerjs';

const getIds = ({ networkName, seats }) => Array.from(
  { length: seats },
  (_, id) => `${networkName}-${id + 1}`,
);

const becomePeerId = (id, options) => new Promise(resolve => {
  const peer = new Peer(id, options);
  peer.on('close', () => resolve(false)); // if id is already taken, the peer will close immediately
  peer.on('open', () => resolve(peer)); // if id is free, the peer will open
});

// try to become each id until vacant seat found
const join = async (peerIds, options) => {
  const peer = await peerIds.reduce(async (memo, id) => {
    const acc = await memo;
    if (acc) return acc; // if already connected skip
    return await becomePeerId(id. options);
  }, false);
  if (!peer) throw new Error('no seats');
  return peer;
};

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  options,
  active = true,
  reducerObject,
} = {}) => {
  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => getIds({ networkName, seats }), [networkName, seats]);

  const reducer = (state, { type, payload }) => {
    ({
      // PING: () => conn.send({ action: 'PONG' }),
      // PONG: () => {
      //   const rtt = window.performance.now() - connections[conn.peer].pingStart;
      //   setConnectionById(conn.peer, {
      //     ping: rtt / 2,
      //     pingStart: undefined,
      //   });
      // },
      // CLOSE: () => {
      //   conn.close();
      //   deleteConnectionById(conn.peer);
      // },
      // SETDATA: (d) => {
      //   console.log('SETDATA', conn.peer, d);
      //   setConnectionById(conn.peer, d);
      // },
      SETPEER: newPeer => ({
        ...state,
        peer: newPeer,
      }),
      OPEN: id => ({
        ...state,
        peerId: id,
      }),
      CLOSE: () => ({
        ...state,
        peer: undefined,
      }),
      DISCONNECTED: () => ({
        ...state,
        peer: undefined,
      }),
      ERROR: err => ({
        ...state,
        peer: undefined,
      }),
      CONNECTION: dataConnection => ({
        ...state,
        peerDataConnections: {
          ...state.peerDataConnections,
          [dataConnection.peer]: {
            dataConnection,
            data: {},
          },
        },
      }),
      CALL: mediaConnection => ({
        ...state,
        peerMediaConnections: {
          ...state.peerMediaConnections,
          [mediaConnection.peer]: {
            mediaConnection,
          },
        },
      }),
      DATAOPEN: ({ dataConnection }) => ({
        ...state,
        peerDataConnections: {
          ...state.peerDataConnections,
          [dataConnection.peer]: {
            ...state.peerDataConnections[dataConnection.peer],
            open: true,
          },
        },
      }),
      DATACLOSE: ({ dataConnection }) => ({
        ...state,
        peerDataConnections: {
          ...state.peerDataConnections,
          [dataConnection.peer]: {
            ...state.peerDataConnections[dataConnection.peer],
            close: true,
          },
        },
      }),
      DATAERROR: ({ dataConnection, err }) => ({
        ...state,
        peerDataConnections: {
          ...state.peerDataConnections,
          [dataConnection.peer]: {
            ...state.peerDataConnections[dataConnection.peer],
            error: err,
          },
        },
      }),
      DATA: ({ dataConnection, data }) => ({
        ...state,
        peerDataConnections: {
          ...state.peerDataConnections,
          [dataConnection.peer]: {
            ...state.peerDataConnections[dataConnection.peer],
            data: {
              ...state.peerDataConnections[dataConnection.peer].data,
              ...data,
            },
          },
        },
      }),
    })[type]?.(payload);
    reducerObject[type]?.(payload);
  };

  const [{ peer, peerDataConnections}, dispatch] = useReducer(reducer, {
    peer: undefined,
    peerId: undefined,
    peerDataConnections: {},
  });
  
  // if config changes or "active", join / leave peerjs service
  useEffect(() => {
    if (active) {
      (async () => {
        const newPeer = await join(peerIds, options); // will throw when no seats
        dispatch({ type: 'OPEN', payload: newPeer });
      })();
    } else {
      state.peer?.destroy();
      dispatch({ type: 'CLOSE' });
    }
  }, [peerIds, active]);

  // when joining peerjs, setup all listeners
  useEffect(() => {
    if (peer) {
      peer.on('open', id => dispatch({ type: 'OPEN', payload: id }));
      peer.on('close', () => dispatch({ type: 'CLOSE' }));
      peer.on('disconnected', () => dispatch({ type: 'DISCONNECTED' }));
      peer.on('error', err => dispatch({ type: 'ERROR', payload: err }));
      peer.on('connection', dataConnection => dispatch({ type: 'CONNECTION', payload: dataConnection }));
      peer.on('call', mediaConnection => dispatch({ type: 'CALL', payload: mediaConnection }));
    }
  }, [peer]);

  // when joining, try to establish outgoing connections to all predefined peer ids (except ours)
  useEffect(() => {
    if (peer) {
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const dataConnection  = peer.connect(
          id,
          {
            label: 'data',
            metadata: {
              msg:'hello, i could put some data here',
            },
          },
        );
        dispatch({ type: 'CONNECTION', payload: dataConnection })
      });
    }
  }, [peer]);

  // if dataConnections changes, register handlers
  useEffect(() => {
    Object.values(peerDataConnections).forEach(({ dataConnection }) => {
      dataConnection.on('open', () => dispatch({ type: 'DATAOPEN', payload: {dataConnection} }));
      dataConnection.on('close', () => dispatch({ type: 'DATACLOSE', payload: {dataConnection} }));
      dataConnection.on('error', err => dispatch({ type: 'DATAERROR', payload: {dataConnection, err} }));
      dataConnection.on('data', data => dispatch({ type: 'DATA', payload: {dataConnection, data} }));
    });

  }, [peerDataConnections]);

  return {
    peerDataConnections,
  };
};

export default usePeerJsMesh;