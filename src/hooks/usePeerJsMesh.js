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
  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => getIds({ networkName, seats }), [networkName, seats]);

  const [peer, setPeer] = useState();
  const [connections, setConnections] = useState();

  // convert connections object to array
  const connectionsArray = useMemo(() => {
    if (!connections) return [];

    // sort by ids alphabetically
    return Object
      .entries(connections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, data]) => ({ id, ...data }));
  }, [connections]);

  const setConnectionById = (id, data) => setConnections(oldConnections => ({
    ...oldConnections,
    [id]: {
      ...oldConnections?.[id],
      ...data,
    },
  }));

  const deleteConnectionById = (id) => {
    setConnectionById(id, { connection: false, idCard: undefined });
  };

  const onOpenWrapper = useCallback(conn => {
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
        // console.log('SETDATA', conn.peer, d);
        setConnectionById(conn.peer, d);
      },
    })[action]?.(payload);
    onData?.(conn, data);
  }, [onData]);

  // if config changes, join and setPeer
  useEffect(() => {
    const cleanUp = p => {
      console.log('LOGOUT');
      p.off('connection');
      p?.disconnect();
      p?.destroy();
      setPeer();
      setConnections();
    };

    let mounted = true;
    if (active) {
      console.log('LOGIN');
      (async () => {
        const newPeer = await join(peerIds); // will throw when no seats
        if (mounted) {
          setPeer(newPeer);
          setConnectionById(newPeer.id, {
            connectionType: 'local',
            connection: newPeer,
          });

          // listen for incoming connections and save them into "connections"
          newPeer.on('connection', conn => setConnectionById(conn.peer, {
            connectionType: 'remote',
            connection: conn,
          }));
        } else cleanUp(newPeer);
      })();
    } else {
      cleanUp(peer);
    }

    return () => mounted = false;
  }, [peerIds, active]);

  // if peer changes, try to establish outgoing
  // connections to all predefined peer ids (except ours)
  useEffect(() => {
    if (peer) {
      console.log('calling all cars!');
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const conn = peer.connect(id, { label: 'data' });
        setConnectionById(id, {
          connectionType: 'remote',
          connection: conn,
        });
      });
    }
  }, [peer]);

  // if connections or event handlers change,
  // register handlers to remote connections
  useEffect(() => {
    if (connectionsArray) {
      const remoteConnections = connectionsArray
        .filter(({ connectionType, connection }) => connectionType === 'remote' && connection);

      remoteConnections.forEach(({ connection }) => {
        connection.on('open', () => onOpenWrapper(connection));
        connection.on('close', () => onCloseWrapper(connection));
        connection.on('data', data => onDataWrapper(connection, data));
      });

      return () => {
        remoteConnections.forEach(({ connection }) => {
          connection.off('open');
          connection.off('close');
          connection.off('data');
        });
      };
    }
  }, [connectionsArray, onOpenWrapper, onCloseWrapper, onDataWrapper]);

  const broadcast = useCallback(data => connectionsArray
    .filter(({ connectionType }) => connectionType === 'remote')
    .forEach(({ connection }) => {
      if (connection) connection.send(data);
    }), [connectionsArray]);

  return {
    peer,
    connections: connectionsArray,
    broadcast,
  };
};

export default usePeerJsMesh;
