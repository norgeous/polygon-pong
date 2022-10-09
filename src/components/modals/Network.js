import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Container, Table } from '../styled/table';
import SystemInfo from '../SystemInfo';
import { Button } from '../styled/menu';
import AddRemoveCpuPlayers from '../controls/AddRemoveCpuPlayers';

const Network = () => {
  const {
    setRoute,
    enableNetwork, setEnableNetwork,
    networkOverview,
    players,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('network')} Players`}
      onClose={() => setRoute()}
    >
      <AddRemoveCpuPlayers />

      {!networkOverview.length && `${getUiIcon('disconnected')} No Connections`}
      {!!networkOverview.length && (
        <Container>
          <Table>
            {networkOverview.map(connection => <SystemInfo {...connection} />)}
          </Table>
        </Container>
      )}

      <Button onClick={() => setEnableNetwork(!enableNetwork)}>
        <span>{getUiIcon(enableNetwork ? 'pause' : 'play')}</span>
        <span>{enableNetwork ? 'Pause Network' : 'Resume Network'}</span>
      </Button>

      <pre>{JSON.stringify(players,null,2)}</pre>
    </Modal>
  );
};

export default Network;
