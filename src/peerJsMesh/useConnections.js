import { useEffect, useCallback } from 'react';
import useStateArray from '../hooks/useStateArray';

const useConnections = ({ peerIds, peer }) => {
  const [connections, setConnectionById] = useStateArray();

  // when joining peerjs
  useEffect(() => {
    if (peer) {
      // listen for incoming connections
      peer.on('connection', dataConnection => setConnectionById(dataConnection.peer, { dataConnection }));

      // try to establish outgoing connections to all predefined peer ids (except ours)
      const everyoneExceptUs = peerIds.filter(id => id !== peer.id);
      everyoneExceptUs.forEach(id => {
        const dataConnection  = peer.connect(id, { label: 'data' });
        setConnectionById(id, { dataConnection, open: false });
      });
    }
  }, [peer]);

  const broadcast = useCallback(packet => {
    connections.forEach(({ dataConnection }) => {
      dataConnection.send(packet);
    });
  }, [connections]);

  return [connections, broadcast];
};

export default useConnections;