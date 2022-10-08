import styled from 'styled-components';

export const Sideways = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
`;

export const Outline = styled.div`
  /* border:1px solid red; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  background: #3037;
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
  :active {
    background: #0007;
  }
`;
