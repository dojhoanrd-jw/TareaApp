import styled from 'styled-components/native';

export const StyledInput = styled.TextInput`
  height: 44px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 15px;
  margin-bottom: 8px;
`;
