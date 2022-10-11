import { useMemo } from 'react';
import usePeerJs from './usePeerJs';
import useConnections from './useConnections';
import useData from './useData';

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  active = true,
  connectionReducer,
  dataReducer,
} = {}) => {
  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => Array.from(
    { length: seats },
    (_, id) => `${networkName}-${id + 1}`,
  ), [networkName, seats]);

  // connect to peerjs signaling server as next available peerId
  const { peer } = usePeerJs({ peerIds, active, connectionReducer });
  
  // setup connections to all other peers in mesh
  const [connections, broadcast] = useConnections({ peerIds, peer });

  // data construct
  const peerData = useData({ connections, dataReducer });

  return {
    peerIds,
    peer,
    connections,
    peerData,
    broadcast,
  };
};

export default usePeerJsMesh;