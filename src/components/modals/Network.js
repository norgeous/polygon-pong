import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Network = () => {
  const {
    setRoute,
    location,
    hostFitness,
    hardCodedPeerIds, peerId, connections2, broadcast, peerData,
  } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <Heading>Connections</Heading>
      {hardCodedPeerIds.map(id => {
        if(id === peerId) return (
          <>
            <Button onClick={()=>broadcast({ message: `click from ${peerId}` })}>
              🫵 {id.replace('polygon-pong-multiplayer-id-','')} {location.country_code} <FlagEmoji countryCode={location.country_code} />
            </Button>
            <pre>{JSON.stringify({ location, hostFitness }, null, 2)}</pre>
          </>
        );
          
        const conn = connections2.find(conn => conn.peer === id);

        if (conn) {
          const pd = peerData[conn.peer];
          return (
            <>
              <Button onClick={()=>broadcast({ message: `click from ${peerId}` })}>
                ✅ {id.replace('polygon-pong-multiplayer-id-','')} {pd?.location?.country_code} <FlagEmoji countryCode={pd?.location?.country_code} />
              </Button>
              <pre>{JSON.stringify(pd, null, 2)}</pre>
            </>
          );
        }

        return null;
        // return <Button>❌ {id.replace('polygon-pong-multiplayer-id-','')}</Button>;
      })}
    </Modal>
  );
};

export default Network;
