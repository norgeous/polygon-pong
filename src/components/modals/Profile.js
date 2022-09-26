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

  const updatePwa = async () => {
    await navigator.serviceWorker.ready;
    // At this point, a Service Worker is controlling the current page
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHES' });
    localStorage.removeItem('location');
    window.location.reload();
  };

  return (
    <Modal
      title={`${getUiIcon('about')} About`}
      onClose={() => setRoute()}
    >
      <Table>
        <Tr>
          <Td>Package Name</Td>
          <Td><a href={sysInfo.packageConfig.repository} target="_blank">{sysInfo.packageConfig.name}</a></Td>
        </Tr>
        <Tr>
          <Td>Package Version</Td>
          <Td>
            <Button onClick={updatePwa}>
              {sysInfo.packageConfig.version}
              {' '}
              {getUiIcon('reload')}
            </Button>
          </Td>
        </Tr>
      </Table>
    </Modal>
  );
};

export default Profile;
