import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Table, Tr, Td } from '../styled/table';

const getIcon = status => ({
  SELF: '🫵',
  CONNECTED: '✅',
  DISCONNECTED: '❌', 
})[status];

const PeerItem = props => {
  const { id, status, location, platform, hostFitness, isHost } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tr onClick={() => setOpen(!open)}>
        <Td>{id?.replace('polygon-pong-multiplayer-','')}</Td>
        <Td>{getIcon(status)}</Td>
        <Td>{platform}{location && `, ${location.city}, ${location.postal}`}</Td>
        <Td>{location && (<>[{location.country_code} <FlagEmoji countryCode={location.country_code} />]</>)}</Td>
        <Td right>{hostFitness}</Td>
        <Td>{isHost && '👑'}</Td>
      </Tr>
      {open && (
        <Tr>
          <Td colSpan="100%">
            <pre>{JSON.stringify(props, null, 2)}</pre>
          </Td>
        </Tr>
      )}
    </>
  );
};

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
      status: 'SELF',
      location,
      platform: navigator.platform,
      hostFitness,
    };
          
    const conn = connections.find(conn => conn.peer === id);

    if (conn) {
      const pd = peerData[conn.peer];
      return {
        id,
        status: 'CONNECTED',
        ...pd,
      };
    }

    return {
      id,
      status: 'DISCONNECTED',
    };
  });

  const whoIsHost = peerList.reduce((a, b) => {
    if (b.hostFitness === undefined) return a;
    if (a.hostFitness < b.hostFitness) return a;
    else return b;
  }, {});

  return (
    <Modal title="🙎 Network" onClose={() => setRoute()}>
      {!peerList.length && '🚷 No Connections'}
      {!!peerList.length && (
        <Table>
          {peerList.map(p => <PeerItem isHost={whoIsHost.id === p.id} {...p} />)}
        </Table>
      )}
    </Modal>
  );
};

export default Network;
