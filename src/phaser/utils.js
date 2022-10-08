import Phaser from 'phaser';

export const calculatePolygonLines = (scene, apothem = 200, playerCount = 4) => {
  const { width, height } = scene.worldbounds;
  const adjustedPlayerCount = ({ 1: 4, 2: 4 })[playerCount] || playerCount;
  const twoPi = 2 * Math.PI;

  // calculate the length of the polygon side
  // const apothem = 200; // distance from the center of the polygon to the midpoint of any side
  const lengthOfSide = 2 * apothem * Math.tan(Math.PI / adjustedPlayerCount);
  const lineCenterX = width / 2;
  const x1 = lineCenterX - (lengthOfSide / 2);
  const x2 = lineCenterX + (lengthOfSide / 2);
  const lineCenterY = height / 2;
  const y1 = lineCenterY + apothem;
  const y2 = lineCenterY + apothem;
  // this.axis = new Phaser.Geom.Line(x1,y1, x2,y2); // line in default "bottom" position

  // // draw some other lines (temporary)
  // for(let i = 0; i < adjustedPlayerCount; i++) {
  //   const line = new Phaser.Geom.Line(x1,y1, x2,y2); // line in default "bottom" position
  //   const angle = (twoPi / adjustedPlayerCount) * i;
  //   Phaser.Geom.Line.RotateAroundXY(line, width / 2, height / 2, angle);
  //   // this.otherAxisGraphics.lineStyle(30, 0x110011, 1);
  //   // this.otherAxisGraphics.strokeLineShape(line);
  // }

  const sides = Array.from({ length: adjustedPlayerCount }, (_, i) => {
    const line = new Phaser.Geom.Line(x1,y1, x2,y2); // line in default "bottom" position
    const angle = (twoPi / adjustedPlayerCount) * i;
    Phaser.Geom.Line.RotateAroundXY(line, width / 2, height / 2, angle);
    return line;
  });

  return sides;
};
