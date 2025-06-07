import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 24px;
  justify-content: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
`;

export const LinkText = styled.Text`
  margin-top: 20px;
  color: ${({ theme }) => theme.primary};
  text-align: center;
`;

export const LogoContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  align-self: center;
  shadow-color: ${({ theme }) => theme.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

export const LogoText = styled.Text`
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 1px;
`;
