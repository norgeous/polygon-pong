import { useState, useEffect, useMemo, useCallback } from 'react';
import Peer from 'peerjs';

const getIds = ({ networkName, seats }) => Array.from(
  { length: seats },
  (_, id) => `${networkName}-${id + 1}`,
);

const becomePeerId = (id) => new Promise(resolve => {
  const peer = new Peer(id);
  peer.on('close', () => resolve(false)); // if id is already taken, the peer will close immediately
  peer.on('open', () => resolve(peer)); // if id is free, the peer will open
});

// try to become each id until vacant seat found
const join = async (peerIds) => {
  const peer = await peerIds.reduce(async (memo, id) => {
    const acc = await memo;
    if (acc) return acc; // if already connected skip
    return await becomePeerId(id);
  }, false);
  if (!peer) throw new Error('no seats');
  return peer;
};

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  active = true,
  onOpen,
  onClose,
  onData,
}) => {
  const [peer, setPeer] = useState();
  const [connections, setConnections] = useState();

  const setConnectionById = (id, data) => {console.log('setConnectionById', id, data); setConnections(oldConnections => ({
      ...oldConnections,
      [id]: {
        ...oldConnections?.[id],
        ...data,
      },
    }));
  };

  const deleteConnectionById = (id) => setConnections(oldConnections => {
    return Object.fromEntries(Object.entries(oldConnections).filter(([cid]) => cid !== id));
  });

  const onOpenWrapper = useCallback((conn, x) => {
    console.log('set to remote', x, conn.peer, conn)
    setConnectionById(conn.peer, {
      connectionType: 'remote',
      connection: conn,
    });
    onOpen?.(conn);
  }, [onOpen]);

  const onCloseWrapper = useCallback(conn => {
    deleteConnectionById(conn.peer);
    onClose?.(conn);
  }, [onClose]);

  const onDataWrapper = useCallback((conn, data) => {
    const { action, payload } = data;
    ({
      CLOSE: () => {
        conn.close();
        deleteConnectionById(conn.peer);
      },
      SETDATA: (d) => {
        setConnectionById(conn.peer, d);
      },
    })[action]?.(payload);
    onData?.(conn, data);
  }, [onData]);

  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => getIds({ networkName, seats }), [networkName, seats]);

  // if config changes, join and setPeer
  useEffect(() => {
    const cleanUp = p => {
      console.log('LOGOUT');
      p?.disconnect();
      p?.destroy();
      setPeer();
      setConnections();
    };
    let mounted = true;
    if (active) {
      console.log('LOGIN');
      (async () => {
        const newPeer = await join(peerIds);
        if (mounted) {
          setPeer(newPeer);
          setConnectionById(newPeer.id, {
            connectionType: 'local',
            connection: newPeer,
          });
        } else cleanUp(newPeer);
      })();
    } else {
      cleanUp(peer);
    }
    return () => mounted = false;
  }, [peerIds, active]);

  // if peer changes, register event callbacks
  // for incoming connections from other peers
  useEffect(() => {
    if (active && peer) {
      peer.on('connection', conn => { // Emitted when a new data connection is established from a remote peer
        conn.on('open', () => onOpenWrapper(conn,'a'));
        conn.on('close', () => onCloseWrapper(conn));
        conn.on('data', data => onDataWrapper(conn, data));
      });
      
      return () => {
        peer.off('connection');
      };
    }
  }, [active, peer, onOpenWrapper, onCloseWrapper, onDataWrapper]);

  // if peer changes, try to establish outgoing
  // connections to all predefined peer ids (except ours)
  useEffect(() => {
    if (active && peer && peerIds.length) {
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const conn = peer.connect(id, { label: 'data' });
        // console.log({id, conn});
        conn.on('open', () => onOpenWrapper(conn,'b'));
        conn.on('close', () => onCloseWrapper(conn));
        conn.on('data', data => onDataWrapper(conn, data));
      });

      return () => {
        // deregister old handlers when wrappers change
        if (connections) {
          Object.values(connections).forEach(({ connectionType, connection }) => {
            if (connectionType === 'remote') {
              connection.off('open');
              connection.off('close');
              connection.off('data');
            }
          });
        }
      };
    }
  }, [active, peer, peerIds, onOpenWrapper, onCloseWrapper, onDataWrapper]);

  return {
    peer,
    connections,
  };
};

export default usePeerJsMesh;
