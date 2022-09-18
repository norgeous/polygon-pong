import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const MainMenu = () => {
  const { packageConfig, setRoute } = useAppContext();

  return (
    <Modal title={`🕹️ ${packageConfig.name}`} onClose={() => setRoute()}>
      <Button onClick={() => setRoute()}><span>👬</span><span>Join Multiplayer</span></Button>
      <Button onClick={() => setRoute('SETTINGS')}><span>⚙️</span><span>Settings...</span></Button>
    </Modal>
  );
};

export default MainMenu;
