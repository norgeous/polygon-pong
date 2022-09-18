import React, { useState } from 'react';
import { getUiIcon, getFlagIcon, getOsIcon, getPlatformIcon, getBrowserIcon } from '../utils/emoji';
import { Tr, Td } from './styled/table';

const SystemInfo = props => {
  const { packageConfig, id, status, location, browser, os, platform, hostFitness, isHost } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tr onClick={() => setOpen(!open)}>
        <Td>{id?.replace('polygon-pong-multiplayer-','')}</Td>
        <Td>{status && getUiIcon(status)}</Td>
        <Td>{browser?.name && getBrowserIcon(browser.name)}</Td>
        <Td>{os?.name &&getOsIcon(os.name)}</Td>
        <Td>{platform?.type && getPlatformIcon(platform.type)}</Td>
        <Td>{getUiIcon('game')} {packageConfig?.version}</Td>
        <Td>{location && (<>{getFlagIcon(location.country_code)} {location.city} {location.country_code}</>)}</Td>
        <Td>{isHost && getUiIcon('host')}</Td>
        <Td right>{hostFitness}</Td>
      </Tr>
      {open && (
        <Tr>
          <Td colSpan="100%">
            <pre>{JSON.stringify(props, null, 2)}</pre>
          </Td>
        </Tr>
      )}
    </>
  );
};

export default SystemInfo;
