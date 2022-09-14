import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Network = () => {
  const {
    setRoute,
    visibilityState,
    location,
    hostFitness,
    peerIds, peerId, connections, broadcast, peerData,
  } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <Heading>Connections</Heading>
      {peerIds.map(id => {
        if(id === peerId) return (
          <>
            <Button onClick={() => broadcast({ message: 'click' })}>
              {id.replace('polygon-pong-multiplayer-','')}
              {' '}
              🫵
              {' '}
              {visibilityState === 'visible' ? '😐' : '🫥'}
              {' '}
              <FlagEmoji countryCode={location.country_code} /> ({location.country_code}) {location.city} {hostFitness}
            </Button>
            {/* <pre>{JSON.stringify({ location, hostFitness, visibilityState }, null, 2)}</pre> */}
          </>
        );
          
        const conn = connections.find(conn => conn.peer === id);

        if (conn) {
          const pd = peerData[conn.peer];
          return (
            <>
              <Button onClick={() => broadcast({ message: 'click' })}>
                {id.replace('polygon-pong-multiplayer-','')}
                {' '}
                ✅
                {' '}
                {pd?.visibilityState === 'visible' ? '😐' : '🫥'}
                {' '}
                <FlagEmoji countryCode={pd?.location?.country_code} /> ({pd?.location?.country_code}) {pd?.location?.city} {pd?.hostFitness}
              </Button>
              {/* <pre>{JSON.stringify(pd, null, 2)}</pre> */}
            </>
          );
        }

        return <Button>{id.replace('polygon-pong-multiplayer-','')} ❌</Button>;
      })}
    </Modal>
  );
};

export default Network;
