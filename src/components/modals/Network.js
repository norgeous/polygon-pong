import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Table } from '../styled/table';
import SystemInfo from '../SystemInfo';

const Network = () => {
  const {
    setRoute,
    networkOverview,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('network')} Network`}
      onClose={() => setRoute()}
    >
      {!networkOverview.length && `${getUiIcon('disconnected')} No Connections`}
      {!!networkOverview.length && (
        <Table>
          {networkOverview.map(connection => <SystemInfo {...connection} />)}
        </Table>
      )}
      {/* <pre>{JSON.stringify(networkOverview, null, 2)}</pre> */}
    </Modal>
  );
};

export default Network;
