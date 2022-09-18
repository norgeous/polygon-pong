import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Table, Tr, Td } from '../styled/table';

const PeerItem = ({ id, icon, location, platform, hostFitness, isHost }) => (
  <>
    <Tr>
      <Td>{id?.replace('polygon-pong-multiplayer-','')}</Td>
      <Td>{icon}</Td>
      <Td>{platform}{location && `, ${location.city}, ${location.postal}`}</Td>
      <Td>{location && (<>[{location.country_code} <FlagEmoji countryCode={location.country_code} />]</>)}</Td>
      <Td right>{hostFitness}</Td>
      <Td>{isHost && '👑 <- HOST'}</Td>
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

    return {
      id,
      icon: '❌',
    };
  });

  const whoIsHost = peerList.reduce((a, b) => {
    if (b.hostFitness === undefined) return a;
    if (a.hostFitness < b.hostFitness) return a;
    else return b;
  }, {});

  return (
    <Modal title="🙎 Network" onClose={() => setRoute()}>
      <Table>
        {peerList.map(p => <PeerItem isHost={whoIsHost.id === p.id} {...p} />)}
      </Table>
    </Modal>
  );
};

export default Network;
