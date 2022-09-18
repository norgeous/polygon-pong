import styled, { css } from 'styled-components';

export const Table = styled.table`
  padding: 10px;
  background: #3037;
`;
export const Tr = styled.tr``;
export const Td = styled.td`
  ${({right}) => right && css`text-align: right;`};
`;
