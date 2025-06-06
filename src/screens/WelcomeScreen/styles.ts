import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.primary};
  padding: 14px 32px;
  border-radius: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 250px;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
