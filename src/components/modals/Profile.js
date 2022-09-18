import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Modal from '../Modal';
import { Heading1 } from '../styled/common';

const Profile = () => {
  const {
    setRoute,
    fps, targetFps,
    cores, ram, timeTaken, hostFitness,
   } = useAppContext();

  return (
    <Modal onClose={() => setRoute('SETTINGS')}>
      <Heading1>Hardware Profile</Heading1>
      <div>
        fps: {fps} / {targetFps} fps
      </div>
      <div>
        cores: {cores}
      </div>
      <div>
        ram: {ram}
      </div>
      <div>
        timeTaken: {timeTaken}
      </div>
      <div>
        hostFitness: {hostFitness}
        <br/>
        ((cores + ram)*10) - timeTaken
      </div>
    </Modal>
  );
};

export default Profile;
