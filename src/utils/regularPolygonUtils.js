import Phaser from 'phaser';

export const regularPolygon = ({ sideLength, apothem, sideCount }) => {
  const lengthOfSide = sideLength || (2 * apothem * Math.tan(Math.PI / sideCount));
  const radius = lengthOfSide / (2 * Math.sin(Math.PI / sideCount));
  const sides = Array.from({ length: sideCount }, (_, i) => ({
    x: Math.round(radius * Math.sin(Math.PI / sideCount * (1+2 * i))),
    y: Math.round(radius * Math.cos(Math.PI / sideCount * (1+2 * i))),
  }));
  return sides;
};
