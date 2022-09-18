import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';
import { Table, Tr, Td } from '../styled/table';
import SystemInfo from '../SystemInfo';

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
          <Td>FPS</Td>
          <Td>{fps} / {targetFps} fps</Td>
        </Tr>
      </Table>
      <Table>
        <SystemInfo {...sysInfo} />
      </Table>
    </Modal>
  );
};

export default Profile;
