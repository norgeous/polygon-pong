import React from 'react';
import useWakeLock from '../../hooks/useWakeLock';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Settings = ({ open, onClose, setRoute }) => {
  const [wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled] = useWakeLock(true);

  const updatePwa = async () => {
    await navigator.serviceWorker.ready;
    // At this point, a Service Worker is controlling the current page
    navigator.serviceWorker.controller.postMessage({
      type: 'MESSAGE_IDENTIFIER',
    });
    window.location.reload();
  };
  
  const reload = () => window.location.reload();

  return (
    <>
      {open && (
        <Modal onClose={onClose}>
          <Heading>Settings</Heading>
          <Button onClick={() => setRoute('MAINMENU')}><span>🕹️</span><span>Main Menu</span></Button>
          <Button onClick={reload}><span>♻️</span><span>Reload</span></Button>
          <Button onClick={updatePwa}><span>🌀</span><span>Clear cache and reload</span></Button>
          <Button as="label">
            <input
              type="checkbox"
              checked={wakeLockEnabled}
              onChange={() => setWakeLockEnabled(!wakeLockEnabled)}
              disabled={!wakeLockAvailable}
            />
            {' '}
            Prevent sleep (wakelock)
          </Button>
          <Button onClick={() => setRoute('PROFILE')}><span>🧰</span><span>Hardware Profile</span></Button>
        </Modal>
      )}
    </>
  );
};

export default Settings;
