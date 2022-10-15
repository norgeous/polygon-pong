import React, { useState } from 'react';
import { getUiIcon, getFlagIcon, getOsIcon, getPlatformIcon, getBrowserIcon, getTimeOfDayIcon, getPlayerTypeIcon } from '../utils/emoji';
import { Tr, Td } from './styled/table';

import { getSunrise, getSunset } from 'sunrise-sunset-js';
const ONE_HOUR = 1 * 60 * 60 * 1000; // ms
const getTimeOfDay = (lat, long) => {
  if (!lat || !long) return 'unknown';

  const sunrise = getSunrise(lat, long);
  const sunset = getSunset(lat, long);
  const now = new Date();

  // if 1 hour either side of sunrise, then it's sunrise (kind of)
  const sunriseStart = new Date(sunrise.getTime() - ONE_HOUR);
  const sunriseEnd = new Date(sunrise.getTime() + ONE_HOUR);
  if (now > sunriseStart && now < sunriseEnd) return 'sunrise';

  // if 1 hour either side of sunset, then it's sunset (kind of)
  const sunsetStart = new Date(sunset.getTime() - ONE_HOUR);
  const sunsetEnd = new Date(sunset.getTime() + ONE_HOUR);
  if (now > sunsetStart && now < sunsetEnd) return 'sunset';

  // if after sunrise and before sunset, then it's day time
  if (now > sunrise && now < sunset) return 'daytime';

  // if before sunrise or after sunset, then it's night time
  if (now < sunrise || now > sunset) return 'nighttime';
  
  return 'unknown';
};

const getStatus = (type, open) => {
  if (type === 'local') return 'SELF';
  if (type === 'cpu') return 'CPU';
  if (open === 'open') return 'CONNECTED';
  return 'DISCONNECTED';
};


const SystemInfo = ({ connection, ...other }) => {
  const { index, type, open, isHost, idCard = {}, ping = 0 } = other;
  const { browserName, city, countryCode, lat, long, osName, platformType, version } = idCard;
  const [openView, setOpenView] = useState(false);
  // const status = getStatus(type, open);
  const timeOfDay = getTimeOfDay(lat, long);

  return (
    <>
      <Tr onClick={() => setOpenView(!openView)}>
        <Td>{index}</Td>
        <Td>{getPlayerTypeIcon(type)}</Td>
        <Td title={browserName}>{browserName && getBrowserIcon(browserName)}</Td>
        <Td title={osName}>{osName && getOsIcon(osName)}</Td>
        <Td title={platformType}>{platformType && getPlatformIcon(platformType)}</Td>
        <Td title={version}>{version && getUiIcon('game')}</Td>
        <Td title={`${city} ${countryCode}`}>{countryCode && getFlagIcon(countryCode)}</Td>
        <Td title={timeOfDay}>{timeOfDay && getTimeOfDayIcon(timeOfDay)}</Td>
        <Td title={`${ping} ping`} right>
          {String(Math.round(ping)).padStart(2, '0')}
        </Td>
        <Td title="is host">{isHost && getUiIcon('host')}</Td>
        <Td>{openView ? getUiIcon('up') : getUiIcon('down')}</Td>
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
