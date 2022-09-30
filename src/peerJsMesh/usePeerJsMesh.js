import { useMemo } from 'react';
import usePeerJs from './usePeerJs';
import useConnections from './useConnections';
import useData from './useData';

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  active = true,
} = {}) => {
  // if networkName or seats changes, generate a new list of peerIds
  const peerIds = useMemo(() => Array.from(
    { length: seats },
    (_, id) => `${networkName}-${id + 1}`,
  ), [networkName, seats]);

  // connect to peerjs signaling server as next available peerId
  const { peer, open } = usePeerJs({ peerIds, active });

  // setup connections to all other peers in mesh
  const [peerConnections, dispatchPeerConnection] = useConnections({ peerIds, peer });

  // listen for data from remote peers
  const dataReducer = {};
  const peerData = useData(peerConnections, dispatchPeerConnection, dataReducer);

  return {
    peer,
    open,
    peerConnections,
    peerData,
  };
};

export default usePeerJsMesh;