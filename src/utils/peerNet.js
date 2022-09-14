import Peer from 'peerjs';

const becomePeerId = (id) => new Promise(resolve => {
  const peer = new Peer(id);

  // if id is already taken, the peer will close immediately
  peer.on('close', () => resolve(false));

  // if id is free, the peer will open
  peer.on('open', () => resolve(peer));
});

const joinPeerMesh = async ({
  networkName,
  maxPeers,
  onConnectionOpen,
  onConnectionClose,
  onConnectionDisconnected,
  onConnectionData,
}) => {
  const peerIds = Array.from(
    { length: maxPeers },
    (_, id) => `${networkName}-${id + 1}`,
  );

  // try to become each id until vacant seat found
  const peer = await peerIds.reduce(async (memo, id) => {
    const acc = await memo;
    if (acc) return acc; // if already connected skip
    return await becomePeerId(id);
  }, false);

  if (peer) {
    // try to establish outgoing connections to all predefined peer ids (except ours)
    peerIds
      .filter(id => id !== peer.id)
      .forEach(id => {
        const conn = peer.connect(id, { label: 'data' });
        conn.on('open', () => onConnectionOpen(peer, conn));
        conn.on('close', () => onConnectionClose(peer, conn));
        conn.on('disconnected', () => onConnectionDisconnected(peer, conn));
        conn.on('data', data => onConnectionData(peer, conn, data));
      });

    // incoming connections from other peers
    peer.on('connection', conn => {
      conn.on('open', () => onConnectionOpen(peer, conn));
      conn.on('close', () => onConnectionClose(peer, conn));
      conn.on('disconnected', () => onConnectionDisconnected(peer, conn));
      conn.on('data', data => onConnectionData(peer, conn, data));
    });
  }

  return { peerIds, peer };
};

export default joinPeerMesh;
