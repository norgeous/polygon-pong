import React from 'react';
import { getBallIcon, getUiIcon } from '../../utils/emoji';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Button } from '../styled/menu';

const HostControls = () => {
  const {
    setRoute,
    balls,
    setBallById,
    removeBallById,
  } = useAppContext();

  const newBall = () => {
    const emoji = getBallIcon();
    setBallById(emoji, { emoji })
  };

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      <Button onClick={newBall}>
        <span>{getUiIcon('add')}</span>
        <span>Add Ball</span>
      </Button>
      {balls.map((ball) => (
        <>
          <Button onClick={() => removeBallById(ball.id)}>
            <span>{getUiIcon('remove')}</span>
            <span>Remove {ball.value.emoji}</span>
          </Button>
          {/* <pre>{JSON.stringify(ball, null, 2)}</pre> */}
        </>
      ))}
    </Modal>
  );
};

export default HostControls;
