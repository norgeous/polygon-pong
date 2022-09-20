import Peer from 'peerjs';


const becomePeerId = (id) => new Promise(resolve => {
  const peer = new Peer(id);

  // if id is already taken, the peer will close immediately
  peer.on('close', () => resolve(false));

  // if id is free, the peer will open
  peer.on('open', () => resolve(peer));
});


const createPeerNet = ({
  networkName,
  maxPeers,
}) => {
  const peerIds = Array.from(
    { length: maxPeers },
    (_, id) => `${networkName}-${id + 1}`,
  );

  const peerNet = {
    networkName,
    maxPeers,
    peer: null,
    connections: Object.fromEntries(peerIds.map(peerId => [
      peerId,
      {
        connectionType: 'none',
        connected: false,
      },
    ])),
    update: () => {},
    onOpen: () => {},
    onClose: () => {},
    onData: () => {},
    start: async function () {
      // console.log('start');
      // try to become each id until vacant seat found
      this.peer = await peerIds.reduce(async (memo, id) => {
        // console.log('processing', id);
        const acc = await memo;
        // console.log('processing2', id);
        if (acc) return acc; // if already connected skip
        // console.log('join as', id);
        return await becomePeerId(id);
      }, false);

      // console.log('got peer?', this.peer);

      if (!this.peer) throw new Error('no seats');

      // console.log('got peer');

      // setup this peer inside connections
      this.connections[this.peer.id].connectionType = 'local';
      this.connections[this.peer.id].connected = true;

      // create callback functions
      const onOpen = conn => {
        this.connections[conn.peer].connectionType = 'remote';
        this.connections[conn.peer].connected = true;
        this.onOpen(conn);
        this.update(this);
      };
      const onClose = conn => {
        this.connections[conn.peer].connectionType = 'none';
        this.connections[conn.peer].connected = false;
        this.onClose(conn);
        this.update(this);
      };
      const onData = (conn, data) => {
        this.onData(conn, data);
        this.update(this);
      };

      // incoming connections from other peers
      this.peer.on('connection', conn => { // Emitted when a new data connection is established from a remote peer.
        conn.on('open', () => onOpen(conn));
        conn.on('close', () => onClose(conn));
        conn.on('data', data => onData(conn, data));
      });

      // try to establish outgoing connections to all predefined peer ids (except ours)
      peerIds.filter(id => id !== this.peer.id).forEach(id => {
        const conn = this.peer.connect(id, { label: 'data' });
        conn.on('open', () => onOpen(conn));
        conn.on('close', () => onClose(conn));
        conn.on('data', data => onData(conn, data));
      });
    },
    stop: function () {
      this.broadcast({ action: 'CLOSE' });
      this.peer.disconnect();
      this.peer.destroy();
      delete this.peer;
    },
    broadcast: function (data) {
      // console.log('BORADCRAST', this.peer, this);
      Object.values(this.peer.connections)
        .forEach(conns => conns.forEach(conn => {
          if (conn.open) conn.send(data);
        }));
    },
  };
  
  return peerNet;
};

export default createPeerNet;
