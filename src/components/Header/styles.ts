import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  padding: 16px 20px;
  background-color: ${({ theme }) => theme.primary};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export const ProfileButton = styled.TouchableOpacity``;
