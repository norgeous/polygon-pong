import React from 'react';
import { getUiIcon } from '../../utils/emoji';
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

  console.log('HostControls got',balls);

  return (
    <Modal
      title={`${getUiIcon('host')} Host Controls`}
      onClose={() => setRoute()}
    >
      <Button onClick={() => setBallById(balls.length+1,{test:'hello'})}>
        <span>{getUiIcon('add')}</span>
        <span>Add Ball</span>
      </Button>
      {balls.map(({ id }) => (
        <Button onClick={() => removeBallById(id)}>
          <span>{getUiIcon('remove')}</span>
          <span>Remove Ball {id}</span>
        </Button>
      ))}
      <pre>{JSON.stringify(balls,null,2)}</pre>
    </Modal>
  );
};

export default HostControls;
