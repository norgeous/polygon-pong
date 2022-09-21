import { useState, useEffect } from 'react';
import createPeerNet from '../utils/peerNet';

const usePeerNet = ({
  networkName,
  maxPeers,
  active = true,
}) => {
  const [peerNet, setPeerNet] = useState();
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

  const onConnectionOpen = conn => setPeerDataById(conn.peer, { connected: true });
  const onConnectionClose = conn => setPeerDataById(conn.peer, { connected: false });
  const onConnectionData = (conn, data) => {
    const { action, payload } = data;
    const reducer2 = {
      // ...reducer,
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
      console.log('PEERNET LOGIN');
      const newPeerNet = createPeerNet({
        networkName,
        maxPeers,
        callbacks: {
          open: onConnectionOpen,
          close: onConnectionClose,
          data: onConnectionData
        },
      });
      setPeerNet(newPeerNet);
      newPeerNet.update = newestPeerNet => setPeerNet({...newestPeerNet}); // update react state after open/close/data
      // newPeerNet.onOpen = () => {
      //   newPeerNet.broadcast({msg: 'hello nice to meet you'});
      // }
      await newPeerNet.start();
    } else {
      console.log('PEERNET LOGOUT');
      peerNet.stop();
      setPeerNet();
      setPeerData({});
    }
  }, [active]);

  return { peerNet, broadcast: peerNet?.broadcast, peerData, setPeerDataById };
};

export default usePeerNet;
