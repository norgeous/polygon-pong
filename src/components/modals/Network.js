import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Container, Table } from '../styled/table';
import SystemInfo from '../SystemInfo';
import { Button } from '../styled/menu';
import AddRemove from '../AddRemove';

const Network = () => {
  const {
    setRoute,
    enableNetwork, setEnableNetwork,
    networkOverview,
    cpuPlayers, setCpuPlayerById, deleteCpuPlayerById,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('network')} Players`}
      onClose={() => setRoute()}
    >
      <AddRemove
        item={`${getUiIcon('cpu')}`}
        count={cpuPlayers.length}
        add={() => {
          const newId = Math.random().toString().replace('0.','');
          setCpuPlayerById(newId, { behaviour: 'normal' });
        }}
        remove={() => {
          const firstAdded = cpuPlayers[0];
          deleteCpuPlayerById(firstAdded.id);
        }}
      />

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
    </Modal>
  );
};

export default Network;
