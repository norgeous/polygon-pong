import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Heading1 } from '../styled/common';
import { Button } from '../styled/menu';

const Network = () => {
  const {
    setRoute,
    location,
    hostFitness,
    peerIds, peerId, connections, broadcast, peerData,
  } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <Heading1>Connections</Heading1>
      {peerIds.map(id => {
        if(id === peerId) return (
          <>
            <Button onClick={() => broadcast({ message: 'click' })}>
              {id.replace('polygon-pong-multiplayer-','')}
              {' '}
              🫵
              {' '}
              {location.city}
              {' '}
              {location.postal}
              {' '}
              ({location.country_code})
              {' '}
              <FlagEmoji countryCode={location.country_code} />
              {' '}
              {navigator.platform}
              {' '}
              {hostFitness}
            </Button>
            {/* <pre>{JSON.stringify({ location, hostFitness }, null, 2)}</pre> */}
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
                {pd?.location?.city}
                {' '}
                {pd?.location?.postal}
                {' '}
                ({pd?.location?.country_code})
                {' '}
                <FlagEmoji countryCode={pd?.location?.country_code} />
                {' '}
                {pd?.platform}
                {' '}
                {pd?.hostFitness}
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
