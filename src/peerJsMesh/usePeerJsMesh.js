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
    return await becomePeerId(id, options);
  }, false);
  if (!peer) throw new Error('no seats');
  return peer;
};

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  options,
  active = true,
  metadata,
  reducerObject = {},
} = {}) => {
  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => getIds({ networkName, seats }), [networkName, seats]);

  // const reducer = (state, { type, payload }) => {
  //   console.log(type);
  //   const newState = ({
  //     // PING: () => conn.send({ action: 'PONG' }),
  //     // PONG: () => {
  //     //   const rtt = window.performance.now() - connections[conn.peer].pingStart;
  //     //   setConnectionById(conn.peer, {
  //     //     ping: rtt / 2,
  //     //     pingStart: undefined,
  //     //   });
  //     // },
  //     // CLOSE: () => {
  //     //   conn.close();
  //     //   deleteConnectionById(conn.peer);
  //     // },
  //     // SETDATA: (d) => {
  //     //   console.log('SETDATA', conn.peer, d);
  //     //   setConnectionById(conn.peer, d);
  //     // },
  //     SETPEER: newPeer => ({
  //       ...state,
  //       peer: newPeer,
  //     }),
  //     OPEN: id => ({
  //       ...state,
  //       peerId: id,
  //     }),
  //     CLOSE: () => ({
  //       ...state,
  //       peer: undefined,
  //     }),
  //     DISCONNECTED: () => ({
  //       ...state,
  //       peer: undefined,
  //     }),
  //     CONNECTION: dataConnection => ({
  //       ...state,
  //       peerDataConnections: {
  //         ...state.peerDataConnections,
  //         [dataConnection.peer]: {
  //           dataConnection,
  //           data: {},
  //         },
  //       },
  //     }),
  //     CALL: mediaConnection => ({
  //       ...state,
  //       peerMediaConnections: {
  //         ...state.peerMediaConnections,
  //         [mediaConnection.peer]: {
  //           mediaConnection,
  //         },
  //       },
  //     }),
  //     DATAOPEN: ({ dataConnection }) => ({
  //       ...state,
  //       peerDataConnections: {
  //         ...state.peerDataConnections,
  //         [dataConnection.peer]: {
  //           ...state.peerDataConnections[dataConnection.peer],
  //           open: true,
  //         },
  //       },
  //     }),
  //     DATACLOSE: ({ dataConnection }) => ({
  //       ...state,
  //       peerDataConnections: {
  //         ...state.peerDataConnections,
  //         [dataConnection.peer]: {
  //           ...state.peerDataConnections[dataConnection.peer],
  //           close: true,
  //         },
  //       },
  //     }),
  //     DATA: ({ dataConnection, data }) => {
  //       const { dtype, dpayload } = data;
  //       ({
  //         PING: () => {},
  //         PONG: () => {},
  //       })[dtype]?.(dpayload);

  //       return ({
  //         ...state,
  //         peerDataConnections: {
  //           ...state.peerDataConnections,
  //           [dataConnection.peer]: {
  //             ...state.peerDataConnections[dataConnection.peer],
  //             data: {
  //               ...state.peerDataConnections[dataConnection.peer].data,
  //               ...data,
  //             },
  //           },
  //         },
  //       });
  //     },
  //   })[type]?.(payload);

  //   reducerObject[type]?.(payload);

  //   return newState;
  // };

  // const [{ peer, peerId, peerDataConnections }, dispatch] = useReducer(reducer, {
  //   peer: undefined,
  //   peerId: undefined,
  //   peerDataConnections: {},
  // });

  const [peer, setPeer] = useState();
  const [open, setOpen] = useState(false);

  const [peerConnections, dispatchPeerConnection] = useReducer((state, { type, payload }) => {
    return ({
      ADD: ({ dataConnection }) => ({
        ...state,
        [dataConnection.peer]: dataConnection,
      }),
      REMOVE: ({ id }) => ({
        ...state,
        [id]: undefined,
      }),
    })[type]?.(payload);
  }, {});

  const [peerData, dispatchPeerData] = useReducer((state, { type, payload }) => {
    // console.log(type);
    return ({
      OPEN: ({ id }) => ({
        ...state,
        [id]: {
          ...state[id],
          open: true,
          data: undefined,
        },
      }),
      DATA: ({ id, data }) => ({
        ...state,
        [id]: {
          ...state[id],
          data: {
            ...state[id].data,
            ...data,
          },
        },
      }),
      CLOSE: ({ id }) => ({
        ...state,
        [id]: {
          ...state[id],
          open: false,
          data: undefined,
        },
      }),
    })[type]?.(payload);
  }, {});

  // if config changes or "active", join / leave peerjs service
  useEffect(() => {
    if (active) {
      (async () => {
        const newPeer = await join(peerIds, options); // will throw when no seats
        setPeer(newPeer);
        setOpen(true);
      })();
    } else {
      peer?.destroy();
      setPeer();
    }
  }, [peerIds, active]);

  // when joining peerjs, setup all listeners
  useEffect(() => {
    if (peer) {
      // Emitted when a connection to the PeerServer is established
      peer.on('open', id => setOpen(true));

      // Emitted when the peer is destroyed and can no longer accept or create any new connections
      peer.on('close', () => setOpen(false));

      // Emitted when the peer is disconnected from the signalling server
      peer.on('disconnected', () => setOpen(false));

      // Emitted when a new data connection is established from a remote peer (INCOMING)
      peer.on('connection', dataConnection => dispatchPeerConnection({ type: 'ADD', payload: { dataConnection } }));
    }
  }, [peer, setOpen, dispatchPeerConnection]);

  // when joining, try to establish outgoing connections to all predefined peer ids (except ours)
  useEffect(() => {
    if (peer) {
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const dataConnection  = peer.connect(id, { label: 'data', metadata });
        dispatchPeerConnection({ type: 'ADD', payload: { dataConnection } }); // OUTGOING
      });
    }
  }, [peer]);

  // if peerConnections changes (both INCOMING and OUTGOING), register handlers
  useEffect(() => {
    Object.values(peerConnections).forEach(dataConnection => {
      console.log('adding handlers to', dataConnection);
      // Emitted when the connection is established and ready-to-use
      dataConnection.on('open', () => dispatchPeerData({ type: 'OPEN', payload: { id: dataConnection.peer } }));

      // Emitted when either you or the remote peer closes the data connection (firefox not supported)
      dataConnection.on('close', () => {
        dispatchPeerConnection({ type: 'REMOVE', payload: { id: dataConnection.peer } });
        dispatchPeerData({ type: 'CLOSE', payload: { id: dataConnection.peer } });
      });

      // Emitted when data is received from the remote peer
      dataConnection.on('data', data => dispatchPeerData({ type: 'DATA', payload: { id: dataConnection.peer, data } }));
    });
  }, [peerConnections]);

  return {
    peer,
    open,
    peerConnections,
    peerData,
  };
};

export default usePeerJsMesh;