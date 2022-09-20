import { useState, useEffect } from 'react';
import createPeerNet from '../utils/peerNet';

const usePeerNet = ({
  networkName,
  maxPeers,
  active = true,
}) => {
  const [peerNet, setPeerNet] = useState();
  const [peer, setPeer] = useState();
  // const [loading, setLoading] = useState(false);
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
    // console.log(`connected to ${conn.peer}`);
    conn.send({
      action: 'SETDATA',
      payload: sysInfo,
    });
    // setConnections(newPeer.connections);
    setPeerDataById(conn.peer, { connected: true });
  };

  const onConnectionClose = (newPeer, conn) => {
    // console.log(`close from ${conn.peer}`);
    // setConnections(newPeer.connections);
    setPeerDataById(conn.peer, { connected: false });
  };

  const onConnectionDisconnected = (newPeer, conn) => {
    // console.log(`disconnected from ${conn.peer}`);
    // setConnections(newPeer.connections);
    setPeerDataById(conn.peer, { connected: false });
  };

  const onConnectionData = (newPeer, conn, data) => {
    // console.log(`data from ${conn.peer}`, data);
    const { action, payload } = data;
    const reducer2 = {
      ...reducer,
      CLOSE: () => {
        conn.close();
        resetPeerDataById(conn.peer);
        setConnections(newPeer.connections);
      },
      SETDATA: () => {
        setPeerDataById(conn.peer, payload);
      },
    };
    reducer2[action]?.(payload) || reducer2.SETDATA(payload);
  };

  // join / leave the peerNet when "active" changes
  useEffect(async () => {
    if (active) {
      console.log('LOGIN');
      // setLoading(true);
      // const {
      //   peerIds: newPeerIds,
      //   peer: newPeer,
      // } = await joinPeerMesh({
      //   networkName,
      //   maxPeers,
      //   on,
      //   // onConnectionOpen,
      //   // onConnectionClose,
      //   // onConnectionDisconnected,
      //   // onConnectionData,
      // });

      const newPeerNet = createPeerNet({networkName, maxPeers});
      setPeerNet(newPeerNet);
      newPeerNet.update = newestPeerNet => setPeerNet({...newestPeerNet}); // update react state after open/close/data
      newPeerNet.onOpen = () => newPeerNet.broadcast({msg: 'hello nice to meet you'});
      
      await newPeerNet.start();
      // console.log(newPeerNet, newPeerNet?.connections?.['polygon-pong-multiplayer-1']);


      // create empty peerData

      // console.log(newPeerData)
      // console.log(newPeerData)
      // console.log(newPeerData)

      // setPeerData(newPeerData);

      // setPeer(newPeer); // save for disconnect, not shared to outside world
      // setLoading(false);
    } else {
      console.log('LOGOUT');
      broadcast({ action: 'CLOSE' });
      peer.disconnect();
      peer.destroy();
      setPeer();

      setPeerData({});
    }
  }, [active]);

  return { peerId: peerNet?.peer?.id, peerNet, setPeerDataById, broadcast: () => {} };
};

export default usePeerNet;
