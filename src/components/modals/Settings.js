import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const Settings = () => {
  const {
    setRoute,
    volume, setVolume,
    wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
  } = useAppContext();


  return (
    <Modal title="⚙️ Settings" onClose={() => setRoute()}>
      {/* <Button onClick={() => setRoute('MAINMENU')}><span>🕹️</span><span>Main Menu</span></Button> */}

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
      <Button onClick={() => setRoute('PROFILE')}><span>🧰</span><span>More...</span></Button>
    </Modal>
  );
};

export default Settings;
