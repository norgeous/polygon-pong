import React from 'react';
import Modal from '../Modal';
import { Heading } from '../styled/common';
import useSystemInfo from '../../hooks/useSystemInfo';

const Profile = ({ open, onClose, fps, targetFps }) => {
  const hostFitness = useSystemInfo();

  return (
    <>
      {open && (
        <Modal onClose={onClose}>
          <Heading>Hardware Profile</Heading>
          {fps} / {targetFps} fps
          <br/>
          <pre>{JSON.stringify(hostFitness,null,2)}</pre>
        </Modal>
      )}
    </>
  );
};

export default Profile;
