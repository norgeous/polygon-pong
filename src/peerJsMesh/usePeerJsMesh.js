import { useMemo } from 'react';
import usePeerJs from './usePeerJs';
import useConnections from './useConnections';
import useData from './useData';

const usePeerJsMesh = ({
  networkName = 'peerjs-mesh',
  seats = 9,
  active = true,
  dataReducer,
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

  // data construct
  const peerData = useData(peerConnections, dispatchPeerConnection, dataReducer);

  // create complete list
  const networkList = useMemo(() => {
    if (!peer) return [];
    return peerIds.reduce((acc, id) => [
      ...acc,
      {
        id,
        index: id.replace(`${networkName}-`,''),
        type: id === peer.id ? 'local' : 'remote',
        open: id === peer.id ? open : peerConnections[id]?.open || false,
        ...peerData[id],
      },
    ], []);
  }, [peerIds, peer, peerConnections, peerData]);

  return {
    networkList,
    peer,
    open,
    peerConnections,
    peerData,
  };
};

export default usePeerJsMesh;