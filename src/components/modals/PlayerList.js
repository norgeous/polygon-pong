import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Container, Table } from '../styled/table';
import SystemInfo from '../SystemInfo';
import { Button } from '../styled/menu';
// import AddRemoveCpuPlayers from '../controls/AddRemoveCpuPlayers';

const PlayerList = () => {
  const {
    setRoute,
    enableNetwork, setEnableNetwork,
    players,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('network')} Players`}
      onClose={() => setRoute()}
    >
      {/* <AddRemoveCpuPlayers /> */}

      {!players.length && `${getUiIcon('disconnected')} No Connections`}
      {!!players.length && (
        <Container>
          <Table>
            {players.map(player => <SystemInfo {...player} />)}
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

export default PlayerList;
