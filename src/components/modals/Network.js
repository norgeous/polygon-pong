import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Table, Tr, Td } from '../styled/table';

const PeerItem = ({ id, icon, location, platform, hostFitness }) => (
  <>
    <Tr>
      <Td>{id?.replace('polygon-pong-multiplayer-','')}</Td>
      <Td>{icon}</Td>
      <Td>{platform}</Td>
      <Td>{location && `${location.city}, ${location.postal} ${location.country_code}`}</Td>
      <Td>{location && <FlagEmoji countryCode={location.country_code} />}</Td>
      <Td>{hostFitness}</Td>
    </Tr>
    {/* <Tr>
      <pre>{JSON.stringify({ location, hostFitness }, null, 2)}</pre>
    </Tr> */}
  </>
);

const Network = () => {
  const {
    setRoute,
    location,
    hostFitness,
    peerIds, peerId, connections, peerData,
  } = useAppContext();

  const peerList = peerIds.map(id => {
    if(id === peerId) return {
      id,
      icon: '🫵',
      location,
      platform: navigator.platform,
      hostFitness,
    };
          
    const conn = connections.find(conn => conn.peer === id);

    if (conn) {
      const pd = peerData[conn.peer];
      return {
        id,
        icon: '✅',
        ...pd,
      };
    }

    // not connected ids
    return {
      id,
      icon: '❌',
    };
  });

  return (
    <Modal title="🙎 Network" onClose={() => setRoute()}>
      <Table>
        {peerList.map(p => <PeerItem {...p} />)}
      </Table>
    </Modal>
  );
};

export default Network;
