import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Heading } from '../styled/common';

const Profile = () => {
  const {
    setRoute,
    fps, targetFps,
    cores, ram, timeTaken, hostFitness,
   } = useAppContext();

  return (
    <Modal onClose={() => setRoute('SETTINGS')}>
      <Heading>Hardware Profile</Heading>
      {fps} / {targetFps} fps
      <br/>
      <pre>{JSON.stringify({ cores, ram, timeTaken, hostFitness },null,2)}</pre>
    </Modal>
  );
};

export default Profile;
