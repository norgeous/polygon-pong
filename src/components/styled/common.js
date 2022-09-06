import styled from 'styled-components';

export const FlexR = styled.div`
  display: flex;
  gap: 10px;
`;

export const Heading = styled.div`
  font-size: 30px;
`;

export const A = styled.a`
  font-size: 20px;
  text-decoration: none;
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