import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import { Button } from '../styled/menu';

const Settings = () => {
  const {
    setRoute,
    volume, setVolume,
    wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
  } = useAppContext();

  const updatePwa = async () => {
    await navigator.serviceWorker.ready;
    // At this point, a Service Worker is controlling the current page
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHES' });
    window.location.reload();
  };
  
  const reload = () => window.location.reload();

  return (
    <Modal onClose={() => setRoute()}>
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
      <Button as="label">
        🔊
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={event => setVolume(event.target.value)}
          style={{ width: '100%' }}
        />
      </Button>
      <Button onClick={() => setRoute('PROFILE')}><span>🧰</span><span>Hardware Profile</span></Button>
    </Modal>
  );
};

export default Settings;
