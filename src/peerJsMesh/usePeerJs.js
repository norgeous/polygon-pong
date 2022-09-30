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
} = {}) => {
  const [peer, setPeer] = useState();
  const [open, setOpen] = useState(false);

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
    }
  }, [peer]);

  return {
    peer,
    open,
  };
};

export default usePeerJs;