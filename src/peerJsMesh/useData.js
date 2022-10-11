import { useEffect } from 'react';
import useStateArray from '../hooks/useStateArray';

const useData = ({
  connections,
  dataReducer = {},
}) => {
  const [peerData, setPeerDataById, deletePeerDataById] = useStateArray();

  // if connections changes (both INCOMING and OUTGOING), register handlers
  useEffect(() => {
    connections.forEach(({ dataConnection }) => {
      const id = dataConnection.peer;

      // Emitted when the connection is established and ready-to-use
      dataConnection.on('open', () => {
        dataConnection.send({ type: 'GREETING' });
        setPeerDataById(id, {});
      });

      // Emitted when either you or the remote peer closes the data connection (firefox not supported)
      dataConnection.on('close', () => {
        deletePeerDataById(id);
      });

      // Emitted when data is received from the remote peer
      dataConnection.on('data', ({ type, payload }) => {
        dataReducer[type]?.({ id, payload, peerData, setPeerDataById });
      });
    });

    // teardown
    return () => {
      connections.forEach(({ dataConnection }) => {
        dataConnection.off('open');
        dataConnection.off('close');
        dataConnection.off('data');
      });
    };
  }, [connections, peerData, dataReducer]);

  // every so often, ping all connections, to get latency
  useEffect(() => {
    const pingEm = () => {
      connections.forEach(({ dataConnection }) => {
        setPeerDataById(dataConnection.peer, {
          pingStart: window.performance.now(),
        });
        dataConnection.send({ type: 'PING' });
      });
    };
    const t = setInterval(pingEm, 10000);
    return () => {
      clearInterval(t);
    };
  }, [connections]);

  return peerData;
};

export default useData;