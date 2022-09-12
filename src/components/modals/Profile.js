import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Heading } from '../styled/common';

const Profile = () => {
  const { setRoute, fps, targetFps, hostFitness } = useAppContext();

  return (
    <Modal onClose={() => setRoute('SETTINGS')}>
      <Heading>Hardware Profile</Heading>
      {fps} / {targetFps} fps
      <br/>
      <pre>{JSON.stringify(hostFitness,null,2)}</pre>
    </Modal>
  );
};

export default Profile;
