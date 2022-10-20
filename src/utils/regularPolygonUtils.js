export const regularPolygon = ({ sideLength, apothem, sideCount }) => {
  const lengthOfSide = sideLength || (2 * apothem * Math.tan(Math.PI / sideCount));
  const radius = lengthOfSide / (2 * Math.sin(Math.PI / sideCount));
  const sides = Array.from({ length: sideCount }, (_, i) => ({
    x: Math.round(radius * Math.sin(Math.PI / sideCount * (1+2 * i))),
    y: Math.round(radius * Math.cos(Math.PI / sideCount * (1+2 * i))),
  }));

  return sides;
};

export const pointsToLines = points => points.map(({ x, y }, i) => {
  const x2 = points[i+1]?.x;
  const y2 = points[i+1]?.y;
  return [
    x,
    y,
    x2 !== undefined ? x2 : points[0].x,
    y2 !== undefined ? y2 : points[0].y,
  ];
}).reverse();

export const pointsToShapes = (points1, points2) => {
  const lines1 = pointsToLines(points1);
  const lines2 = pointsToLines(points2);
  const shapes = lines1.map(([x1, y1, x2, y2], i) => {
    const [x3, y3, x4, y4] = lines2[i];
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x4, y: y4 },
      { x: x3, y: y3 },
    ];
  });
  return shapes;
};
