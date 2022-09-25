import styled from 'styled-components';

export const Sideways = styled.div`
  display: flex;
  max-width: 320px;
  flex-wrap: wrap;
`;

export const Button = styled.button`
  border: 0;
  font-size: 16px;
  background: #3037;
  color: white;
  padding: 10px;
  cursor: pointer;
  display: block;
  /* width: 100%; */
  display: flex;
  gap: 10px;
  box-sizing: border-box;
  text-align: left;
  :hover {
    background: #1017;
  }
`;
