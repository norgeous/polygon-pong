import { useState, useEffect } from 'react';
import Peer from 'peerjs';

const hardCodedPeerIds = [
  'polygon-pong-multiplayer-id-01',
  'polygon-pong-multiplayer-id-02',
  'polygon-pong-multiplayer-id-03',
  'polygon-pong-multiplayer-id-04',
  'polygon-pong-multiplayer-id-05',
  'polygon-pong-multiplayer-id-06',
];

const useConnections = (defaultConns) => {
  const [connections, setConnections] = useState(defaultConns);

  // reduce to active only connections
  const connections2 = Object.values(connections).reduce((acc, conns) => {
    const openConn = conns.reduce((acc, connection) => connection.open ? connection : acc, false);
    if (!openConn) return acc;
    return [...acc, openConn];
  }, []);

  const broadcast = (data) => {
    console.log('broadcasting to', connections);
    connections2.forEach(connection => connection.send(data));
  };

  return [connections2, setConnections, broadcast]
};

const usePeer = ({ location, hostFitness }) => {
  const [i, setI] = useState(0);
  const [peerId, setPeerId] = useState();
  const [connections, setConnections, broadcast] = useConnections({});
  const [peerData, setPeerData] = useState({});

  // console.log(connections);

  const setPeerDataById = (id, data) => setPeerData(oldPeerData => {
    oldPeerData[id] = {
      ...oldPeerData[id],
      ...data,
    };
    return oldPeerData;
  });

  const resetPeerDataById = (id) => setPeerData(oldPeerData => {
    delete oldPeerData[id];
    return oldPeerData;
  });

  const onConnectionOpen = (newPeer, conn) => {
    console.log(`connected to ${conn.peer}`);
    conn.send({
      message: 'hello',
      location,
      hostFitness,
    });
    setConnections(newPeer.connections);
  };
  const onConnectionClose = (newPeer, conn) => {
    console.log(`close from ${conn.peer}`);
    setConnections(newPeer.connections);
  };
  const onConnectionDisconnected = (newPeer, conn) => {
    console.log(`disconnected from ${conn.peer}`);
    setConnections(newPeer.connections);
  };
  const onConnectionData = (newPeer, conn, data) => {
    console.log(`data from ${conn.peer}`, data);

    setPeerDataById(conn.peer, data);

    switch(data.action) {
      case 'CLOSE':
        conn.close();
        resetPeerDataById(conn.peer);
        break;
    }

    setConnections(newPeer.connections);
  };

  useEffect(() => {
    if (!location || !hostFitness) return;

    const newPeer = new Peer(hardCodedPeerIds[i]);

    // if id is already taken, the peer will close immediately, try the next id in the list
    newPeer.on('error', () => setConnections(newPeer.connections));
    newPeer.on('close', () => setI(i + 1));

    // if id is free, the peer will open
    newPeer.on('open', () => {
      setPeerId(newPeer.id);

      // try to establish outgoing connections to all predefined peer ids
      const newConnections = hardCodedPeerIds.map(id => {
        const conn = newPeer.connect(id, { label: 'data' });
        conn.on('open', () => onConnectionOpen(newPeer, conn));
        conn.on('close', () => onConnectionClose(newPeer, conn));
        conn.on('disconnected', () => onConnectionDisconnected(newPeer, conn));
        conn.on('data', data => onConnectionData(newPeer, conn, data));
        return conn;
      });

    });

    // incoming connections from other peers
    newPeer.on('connection', conn => {
      conn.on('open', () => onConnectionOpen(newPeer, conn));
      conn.on('close', () => onConnectionClose(newPeer, conn));
      conn.on('disconnected', () => onConnectionDisconnected(newPeer, conn));
      conn.on('data', data => onConnectionData(newPeer, conn, data));
    });
  }, [location, hostFitness, i]);

  // broadcast visibilitychange events
  useEffect(() => {
    const broadcastVisibility = () => {
      console.log({ visibilityState: document.visibilityState, broadcast });
      broadcast({ visibilityState: document.visibilityState });
      // if (document.visibilityState === 'hidden') {
        // navigator.sendBeacon('/log', analyticsData);
      // }
    };
    document.addEventListener('visibilitychange', broadcastVisibility);
    return () => document.removeEventListener('visibilitychange', broadcastVisibility);
}, [broadcast]);

  return { hardCodedPeerIds, peerId, connections, broadcast, peerData };
};

export default usePeer;
