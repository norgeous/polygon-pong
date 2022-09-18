import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const MainMenu = () => {
  const { sysInfo, setRoute } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('game')} ${sysInfo.packageConfig.name}`}
      onClose={() => setRoute()}
    >
      <Button onClick={() => setRoute()}>
        <span>{getUiIcon('multiplayer')}</span>
        <span>Join Multiplayer</span>
      </Button>
      <Button onClick={() => setRoute('SETTINGS')}>
        <span>{getUiIcon('settings')}</span>
        <span>Settings...</span>
      </Button>
    </Modal>
  );
};

export default MainMenu;
