import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 20px 10px 1px 10px;
`;

export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  align-self: flex-start;
`;

export const BackButtonText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 24px 24px;
`;

export const TopSection = styled.View`
  align-items: center;
  justify-content: flex-start;
`;

export const BottomSection = styled.View`
  width: 100%;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 24px;
`;

export const Name = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

export const ThemeContainer = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ThemeLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;
