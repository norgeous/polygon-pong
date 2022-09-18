import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { FlexRow, FlexColumn, Heading1, Heading2, A } from '../styled/common';
import { Button } from '../styled/menu';

const MainMenu = () => {
  const { packageConfig, setRoute } = useAppContext();

  return (
    <Modal onClose={() => setRoute()}>
      <A href={packageConfig.repository} target="_blank">
        <FlexRow>
          <img src="icon.svg" width="60" />
          <FlexColumn>
            <Heading1>{packageConfig.name}</Heading1>
            <Heading2>{packageConfig.version}</Heading2>
          </FlexColumn>
        </FlexRow>
      </A>
      <Button onClick={() => setRoute()}><span>👬</span><span>Join Multiplayer (WIP)</span></Button>
      <Button onClick={() => setRoute('SETTINGS')}><span>⚙️</span><span>Settings</span></Button>
    </Modal>
  );
};

export default MainMenu;
