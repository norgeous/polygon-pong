import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Heading1 } from '../styled/common';

const Profile = () => {
  const {
    setRoute,
    fps, targetFps,
    hostFitness,
   } = useAppContext();

  return (
    <Modal onClose={() => setRoute('SETTINGS')}>
      <Heading1>Hardware Profile</Heading1>
      <div>
        fps: {fps} / {targetFps} fps
      </div>
      <div>
        hostFitness: {hostFitness}
      </div>
    </Modal>
  );
};

export default Profile;
