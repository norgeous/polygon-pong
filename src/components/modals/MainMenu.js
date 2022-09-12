import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { FlexR, Heading, A } from '../styled/common';
import { Button } from '../styled/menu';

const MainMenu = () => {
  const { setRoute } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <FlexR>
        <img src="icon.svg" width="60" />
        <div>
          <Heading>Polygon Pong</Heading>
          <A href="https://github.com/norgeous/polygon-pong/" target="_blank">
            norgeous/polygon-pong
          </A>
        </div>
      </FlexR>
      <Button onClick={() => setRoute()}><span>👬</span><span>Join Multiplayer (WIP)</span></Button>
      <Button onClick={() => setRoute('SETTINGS')}><span>⚙️</span><span>Settings</span></Button>
    </Modal>
  );
};

export default MainMenu;
