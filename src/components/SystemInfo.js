import React, { useState } from 'react';
import { getUiIcon, getFlagIcon, getOsIcon, getPlatformIcon, getBrowserIcon } from '../utils/emoji';
import { Tr, Td } from './styled/table';

const SystemInfo = props => {
  const { connection, ...other } = props;
  const { id, type, open, isHost, idCard = {}, ping } = other;
  const { browserName, city, countryCode, osName, platformType, postal, version } = idCard;
  const [openView, setOpenView] = useState(false);
  const status = type === 'local' ? 'SELF' : open ? 'CONNECTED' : 'DISCONNECTED';

  return (
    <>
      <Tr onClick={() => setOpenView(!openView)}>
        <Td>{id?.replace('polygon-pong-multiplayer-','')}</Td>
        <Td> {getUiIcon(status)}</Td>
        <Td>{browserName && getBrowserIcon(browserName)}</Td>
        <Td>{osName &&getOsIcon(osName)}</Td>
        <Td>{platformType && getPlatformIcon(platformType)}</Td>
        <Td>{version && getUiIcon('game')} {version}</Td>
        <Td>{countryCode && getFlagIcon(countryCode)} {city}</Td>
        <Td right style={{ fontFamily: 'monospace' }}>
          {ping && String(Math.round(ping || 0)).padStart(3, '0')}
        </Td>
        <Td>{isHost && getUiIcon('host')}</Td>
      </Tr>
      {openView && (
        <Tr>
          <Td colSpan="100%">
            <pre>{JSON.stringify(other, null, 2)}</pre>
          </Td>
        </Tr>
      )}
    </>
  );
};

export default SystemInfo;
