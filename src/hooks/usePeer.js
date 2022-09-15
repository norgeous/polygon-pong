import { useState, useEffect } from 'react';
import joinPeerMesh from '../utils/peerNet';

const useConnections = (defaultConns) => {
  const [connections, setConnections] = useState(defaultConns);

  // reduce to active only connections
  const connections2 = Object.values(connections).reduce((acc, conns) => {
    const openConn = conns.reduce((acc, connection) => connection.open ? connection : acc, false);
    if (!openConn) return acc;
    return [...acc, openConn];
  }, []);

  const broadcast = (data) => {
    // console.log('broadcasting to', connections);
    connections2.forEach(connection => connection.send(data));
  };

  return [connections2, setConnections, broadcast]
};

const usePeer = ({ location, hostFitness, visibilityState }) => {
  const [connections, setConnections, broadcast] = useConnections({});
  const [peerIds, setPeerIds] = useState([]);
  const [peer, setPeer] = useState();
  const [peerData, setPeerData] = useState({});

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
      visibilityState,
      platform: navigator.userAgentData.platform,
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

  useEffect(async () => {
    if (!location || !hostFitness || !visibilityState) return;

    if (visibilityState === 'visible') {
      console.log('LOGIN');
      const {
        peerIds: newPeerIds,
        peer: newPeer,
      } = await joinPeerMesh({
        networkName: 'polygon-pong-multiplayer',
        maxPeers: 6,
        onConnectionOpen,
        onConnectionClose,
        onConnectionDisconnected,
        onConnectionData,
      });

      setPeerIds(newPeerIds);
      setPeer(newPeer); 
    }

    if (visibilityState === 'hidden') {
      console.log('LOGOUT');
      peer.destroy();
    }
  }, [location, hostFitness, visibilityState]);

  return { peerIds, peerId: peer?.id, connections, broadcast, peerData };
};

export default usePeer;
