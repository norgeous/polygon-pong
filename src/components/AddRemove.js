import React from 'react';
import { getUiIcon } from '../utils/emoji';
import { Sideways, Outline, Button } from './styled/menu';

const AddRemove = ({item, count = 0, add, remove}) => {
  return (
    <Sideways>
      <Outline>
        <Button onClick={remove}>
          {getUiIcon('remove')}
        </Button>
        {item}×{String(Math.round(count)).padStart(2, '0')}
        <Button onClick={add}>
          {getUiIcon('add')}
        </Button>
      </Outline>
    </Sideways>
  );
};

export default AddRemove;
