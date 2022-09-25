import React from 'react';
import { getUiIcon, getVolumeIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const Settings = () => {
  const {
    setRoute,
    volume, setVolume,
    showFps, setShowFps,
    wakeLockAvailable, wakeLockEnabled, setWakeLockEnabled,
  } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('settings')} Settings`}
      onClose={() => setRoute()}
    >

      <Button as="label">
        {getVolumeIcon(volume)}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={event => {
            // console.log('wtf?',Number(event.target.value));
            setVolume(Number(event.target.value));
          }}
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

      <Button as="label">
        <input
          type="checkbox"
          checked={showFps}
          onChange={() => setShowFps(!showFps)}
        />
        {' '}
        Show FPS
      </Button>

      <Button onClick={() => setRoute('PROFILE')}>
        <span>{getUiIcon('toolbox')}</span>
        <span>More...</span>
      </Button>
    </Modal>
  );
};

export default Settings;
