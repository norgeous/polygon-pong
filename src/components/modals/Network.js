import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Table } from '../styled/table';
import SystemInfo from '../SystemInfo';
import { Button } from '../styled/menu';

const Network = () => {
  const {
    setRoute,
    enableNetwork, setEnableNetwork,
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

      <Button onClick={() => setEnableNetwork(!enableNetwork)}>
        <span>{getUiIcon(enableNetwork ? 'pause' : 'play')}</span>
        <span>{enableNetwork ? 'Pause Network' : 'Resume Network'}</span>
      </Button>

      <Button>
        <span>{getUiIcon('cpu')}</span>
        <span>Add CPU player</span>
      </Button>
    </Modal>
  );
};

export default Network;
