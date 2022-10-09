import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 200px;
  overflow: auto;
`;

export const Table = styled.table`
  padding: 10px;
  background: #3037;
  white-space: nowrap;
`;

export const Tr = styled.tr``;

export const Td = styled.td`
  font-family: monospace;
  ${({right}) => right && css`text-align: right;`};
`;
