import React from 'react';
import { getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const HostControls = () => {
  const { setRoute, game } = useAppContext();
  const scene = game?.scene?.scenes?.[0];

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      <Button onClick={() => scene.addBall()}>
        <span>{getUiIcon('add')}</span>
        <span>Add Ball</span>
      </Button>
      <Button onClick={() => scene.removeBall()}>
        <span>{getUiIcon('remove')}</span>
        <span>Remove Ball</span>
      </Button>
    </Modal>
  );
};

export default HostControls;
