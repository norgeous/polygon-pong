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

  return [connections, setConnections, broadcast];
};
















// const usePeerData






const usePeer = (game) => {
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
      action: 'SETDATA',
      payload: game.sysInfo,
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
    const { action, payload } = data;
    const reducer = {
      CLOSE: () => {
        conn.close();
        resetPeerDataById(conn.peer);
        setConnections(newPeer.connections);
      },
      SETBALL: () => {
        const scene = game.scene.scenes[0];
        scene.ball.setState(payload);
      },
      SETDATA: () => {
        setPeerDataById(conn.peer, payload);
      },
    };
    reducer[action]?.(payload) || reducer.SETDATA(payload);
  };

  // join / leave the peerNet when visibilityState changes
  useEffect(async () => {
    // console.log('game changed, i might join', game, game?.sysInfo?.visibilityState, peer, loading);
    if (!game) return;

    if (game.sysInfo?.visibilityState === 'visible' && !peer && !loading) {
      console.log('LOGIN');
      setLoading(true);
      const {
        peerIds: newPeerIds,
        peer: newPeer,
      } = await joinPeerMesh({
        networkName: 'polygon-pong-multiplayer',
        maxPeers: 9,
        onConnectionOpen,
        onConnectionClose,
        onConnectionDisconnected,
        onConnectionData,
      });

      setPeerIds(newPeerIds);
      setPeer(newPeer); 
      setLoading(false);
    }

    if (game.sysInfo?.visibilityState === 'hidden') {
      console.log('LOGOUT');
      broadcast({ action: 'CLOSE' });
      peer.disconnect();
      peer.destroy();
      setPeer();
    }
  }, [game]);

  return { peerIds, peerId: peer?.id, connections, broadcast, peerData };
};

export default usePeer;
