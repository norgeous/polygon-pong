import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import FlagEmoji from '../FlagEmoji';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Network = () => {
  const {
    setRoute,
    countryCode,
    hardCodedPeerIds, peerId, connections2, broadcast, peerData,
  } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <Heading>Connections</Heading>
      {hardCodedPeerIds.map(id => {
        if(id === peerId) return (
          <Button onClick={()=>broadcast({ message: `click from ${peerId}` })}>
            🫵 {id.replace('polygon-pong-multiplayer-id-','')} {countryCode} <FlagEmoji countryCode={countryCode} />
          </Button>
        );
          
        const conn = connections2.find(conn => conn.peer === id);

        if (conn) {
          const pd = peerData[conn.peer] || {};
          const { countryCode } = pd;
          return (
            <>
              <Button onClick={()=>broadcast({ message: `click from ${peerId}` })}>
                ✅ {id.replace('polygon-pong-multiplayer-id-','')} {countryCode} <FlagEmoji countryCode={countryCode} />
              </Button>
              <pre>{JSON.stringify(pd, null, 2)}</pre>
            </>
          );
        }

        return <Button>❌ {id}</Button>;
      })}
    </Modal>
  );
};

export default Network;
