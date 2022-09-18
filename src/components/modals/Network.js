import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Table } from '../styled/table';
import SystemInfo from '../SystemInfo';

const Network = () => {
  const {
    setRoute,
    location,
    hostFitness,
    peerIds, peerId, connections, peerData,
    sysInfo,
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
    <Modal
      title={`${getUiIcon('network')} Network`}
      onClose={() => setRoute()}
    >
      {!peerList.length && `${getUiIcon('disconnected')} No Connections`}
      {!!peerList.length && (
        <Table>
          {peerList.map(p => p.id === peerId ?<SystemInfo {...sysInfo} {...p} />:<SystemInfo isHost={whoIsHost.id === p.id} {...p} />)}
        </Table>
      )}
    </Modal>
  );
};

export default Network;
