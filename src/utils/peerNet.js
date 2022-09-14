import Peer from 'peerjs';

const becomePeerId = (id) => new Promise(resolve => {
  const newPeer = new Peer(id);

  // if id is already taken, the peer will close immediately
  newPeer.on('close', () => resolve(false));

  // if id is free, the peer will open
  newPeer.on('open', () => resolve(newPeer));
});

// joinPeerMesh({ networkName:'polygon-pong-multiplayer', maxPeers:6 });
const joinPeerMesh = ({ networkName, maxPeers }) => {
  const peerIds = Array.from({ length: maxPeers }, (_, id) => `${networkName}-${id}`);

  // try to become each id until vacant seat found
  const peer = peerIds.reduce(async (acc, id) => {
    if (acc) return acc; // if already connected skip id
    return await becomePeerId(id);
  }, false);

  console.log(peer);

  return peer;
};

export default joinPeerMesh;
