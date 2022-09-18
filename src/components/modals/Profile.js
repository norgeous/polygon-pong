import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';
import { Table, Tr, Td } from '../styled/table';

const Profile = () => {
  const {
    setRoute,
    fps, targetFps,
    sysInfo,
  } = useAppContext();

  const reload = () => window.location.reload();
  const updatePwa = async () => {
    await navigator.serviceWorker.ready;
    // At this point, a Service Worker is controlling the current page
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHES' });
    reload();
  };

  return (
    <Modal
      title={`${getUiIcon('toolbox')} More`}
      onClose={() => setRoute()}
    >
      <Button onClick={reload}>
        <span>{getUiIcon('reload')}</span>
        <span>Reload</span>
      </Button>
      <Button onClick={updatePwa}>
        <span>{getUiIcon('reset')}</span>
        <span>Clear cache and reload</span>
      </Button>
      <Table>
        <Tr>
          <Td>Package Name</Td>
          <Td><a href={sysInfo.packageConfig.repository} target="_blank">{sysInfo.packageConfig.name}</a></Td>
        </Tr>
        <Tr>
          <Td>Version</Td>
          <Td>{sysInfo.packageConfig.version}</Td>
        </Tr>
        <Tr>
          <Td>FPS</Td>
          <Td>{fps} / {targetFps} fps</Td>
        </Tr>
        <Tr>
          <Td>Benchmark</Td>
          <Td>{sysInfo.hostFitness} ms</Td>
        </Tr>
        <Tr>
          <Td>Battery</Td>
          <Td>{sysInfo.batteryPercent}</Td>
        </Tr>
        <Tr>
          <Td>Local time</Td>
          <Td>{sysInfo.clock}</Td>
        </Tr>
      </Table>
      <pre>{JSON.stringify(sysInfo, null, 2)}</pre>
    </Modal>
  );
};

export default Profile;
