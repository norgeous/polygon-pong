import React from 'react';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Network = ({
  open, onClose,
  hardCodedPeerIds, peerId, connections2, broadcast, peerData,
}) => {
  return (
    <>
      {open && (
        <Modal onClose={onClose}>
          <Heading>Connections</Heading>
          {hardCodedPeerIds.map(id => {
            if(id === peerId) return (
              <Button onClick={()=>broadcast(`click from ${peerId}`)}>🫵 {id.replace('my-pwa-multiplayer-id-','')}</Button>
            );
              
            const conn = connections2.find(conn => conn.peer === id);

            return (    
              <Button onClick={()=>broadcast(`click from ${peerId}`)}>{conn ? '✅' : '❌'} {id.replace('my-pwa-multiplayer-id-','')}</Button>
            );
          })}
          <pre>{JSON.stringify(peerData, null, 2)}</pre>
        </Modal>
      )}
    </>
  );
};

export default Network;
