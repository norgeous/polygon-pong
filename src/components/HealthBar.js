import { getGameIcon } from '../utils/emoji';

const HealthBar = ({ value, max }) => {
  const a = Array.from({ length: max }, (_, i) => value > i);
  return a.map(is => getGameIcon(is ? 'heart_on' : 'heart_off'));
};

export default HealthBar;
