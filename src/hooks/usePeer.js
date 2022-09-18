import { useState, useEffect } from 'react';
import joinPeerMesh from '../utils/peerNet';

const useConnections = () => {
  const [connections, _setConnections] = useState([]);

  const setConnections = (newConnections) => {
    // reduce to active only connections
    const connections2 = Object.values(newConnections).reduce((acc, conns) => {
      const openConn = conns.reduce((acc, connection) => connection.open ? connection : acc, false);
      if (!openConn) return acc;
      return [...acc, openConn];
    }, []);
    _setConnections(connections2);
  };

  const broadcast = (data) => {
    // console.log('broadcasting to', connections);
    connections.forEach(connection => connection.send(data));
  };

  return [connections, setConnections, broadcast]
};






const usePeer = (game, { location, hostFitness, visibilityState }) => {
  const [peer, setPeer] = useState();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections, broadcast] = useConnections();
  const [peerIds, setPeerIds] = useState([]);
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
      platform: navigator.platform,
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
    switch(data.action) {
      case 'CLOSE':
        conn.close();
        resetPeerDataById(conn.peer);
        setConnections(newPeer.connections);
        break;
      case 'SETBALL':
        // console.log(game.scene.scenes[0].ball.ball);
        game.scene.scenes[0].ball.ball.x = data.ball.x;
        game.scene.scenes[0].ball.ball.y = data.ball.y;
        game.scene.scenes[0].ball.ball.setVelocity(
          data.ball.vx,
          data.ball.vy,
        );
        // console.log(data.ball.angle);
        game.scene.scenes[0].ball.ball.setRotation(data.ball.angle);
        game.scene.scenes[0].ball.ball.setAngularVelocity(data.ball.angularVelocity);
        break;
      default:
        setPeerDataById(conn.peer, data);
        break;
    }
  };

  // join / leave the peerNet when visibilityState changes
  useEffect(async () => {
    if (!game || !location || !hostFitness || !visibilityState) return;

    if (visibilityState === 'visible' && !peer && !loading) {
      // console.log('LOGIN', visibilityState, peer, loading);
      setLoading(true);
      const {
        peerIds: newPeerIds,
        peer: newPeer,
      } = await joinPeerMesh({
        networkName: 'polygon-pong-multiplayer',
        maxPeers: 10,
        onConnectionOpen,
        onConnectionClose,
        onConnectionDisconnected,
        onConnectionData,
      });

      setPeerIds(newPeerIds);
      setPeer(newPeer); 
      setLoading(false);
    }

    if (visibilityState === 'hidden') {
      // console.log('LOGOUT');
      broadcast({ action: 'CLOSE' });
      peer.disconnect();
      peer.destroy();
      setPeer();
    }
  }, [game, location, hostFitness, visibilityState]);

  return { peerIds, peerId: peer?.id, connections, broadcast, peerData };
};

export default usePeer;
