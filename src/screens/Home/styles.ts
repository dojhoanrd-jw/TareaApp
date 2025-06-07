import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const AddButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.primary};
  justify-content: center;
  align-items: center;
`;

export const AddButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: bold;
  line-height: 24px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;

export const EmptyText = styled.Text`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 16px;
  text-align: center;
  margin-bottom: 8px;
`;

export const FloatingActionButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.primary};
  justify-content: center;
  align-items: center;
  elevation: 8;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
  z-index: 1000;
`;

export const FABIcon = styled.Text`
  color: #FFFFFF;
  font-size: 24px;
  font-weight: bold;
  line-height: 24px;
`;
