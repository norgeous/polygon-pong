import styled from 'styled-components';

export const FlexRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Heading1 = styled.h1`
  font-size: 30px;
  margin: 0;
`;

export const Heading2 = styled.h2`
  font-size: 20px;
  margin: 0;
`;

export const A = styled.a`
  font-size: 20px;
  text-decoration: none;
  color: #077;
  :visited,
  :hover {
    color: #077;
  }
`;

export const Button = styled.button`
  /* border: 1px solid red; */
  border: 0;
  font-size: 16px;
  background: transparent;
  color: white;
  padding: 10px;
  cursor: pointer;
`;