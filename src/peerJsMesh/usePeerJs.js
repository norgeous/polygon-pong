import { useState, useEffect } from 'react';
import Peer from 'peerjs';

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

const usePeerJs = ({
  peerIds,
  options,
  active = true,
  connectionReducer,
} = {}) => {
  const [peer, setPeer] = useState();

  // if config changes or "active", join / leave peerjs service
  useEffect(() => {
    if (active) {
      (async () => {
        const newPeer = await join(peerIds, options); // will throw when no seats
        setPeer(newPeer);
      })();
    } else {
      peer?.destroy();
      setPeer();
    }
  }, [peerIds, active]);

  // when joining peerjs, setup all listeners
  useEffect(() => {
    if (peer) {
      // save the connection to players array
      connectionReducer['OPEN']({
        id: peer.id,
        payload: { controlType: 'local' },
      });

      // Emitted when the peer is destroyed and can no longer accept or create any new connections
      peer.on('close', () => connectionReducer['CLOSE']({ id: peer.id }));

      // Emitted when the peer is disconnected from the signalling server
      peer.on('disconnected', () => connectionReducer['CLOSE']({ id: peer.id }));
    }
  }, [peer]);

  return {
    peer,
  };
};

export default usePeerJs;