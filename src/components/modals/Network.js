import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Table } from '../styled/table';
import SystemInfo from '../SystemInfo';

const Network = () => {
  const {
    setRoute,
    connections,
    networkOverview,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('network')} Network`}
      onClose={() => setRoute()}
    >
      {!connections.length && `${getUiIcon('disconnected')} No Connections`}
      {!!connections.length && (
        <Table>
          {connections.map(connection => <SystemInfo {...connection} />)}
        </Table>
      )}
      <pre>{JSON.stringify(networkOverview, null, 2)}</pre>
    </Modal>
  );
};

export default Network;
