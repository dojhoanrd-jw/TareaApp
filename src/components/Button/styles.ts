import styled from 'styled-components/native';

export const StyledButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme }) => theme.primary};
  padding: 14px;
  border-radius: 25px;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 16px;
`;
