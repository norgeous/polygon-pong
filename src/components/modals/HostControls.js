import React from 'react';
import { getUiIcon, getBallIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const HostControls = () => {
  const { setRoute, game } = useAppContext();

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      <Button onClick={() => setRoute()}>
        <span>{getBallIcon()}</span>
        <span>Add Ball</span>
      </Button>
      <Button onClick={() => setRoute()}>
        <span>{getBallIcon()}</span>
        <span>Remove Ball</span>
      </Button>
    </Modal>
  );
};

export default HostControls;
