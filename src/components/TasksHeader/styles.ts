import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${({ theme }) => theme.background};
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const DropdownContainer = styled.View`
  position: relative;
  min-width: 120px;
  z-index: 1000;
`;

export const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  border: 1px solid ${({ theme }) => theme.border};
  min-width: 120px;
`;

export const DropdownText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  font-weight: 500;
`;

export const DropdownModal = styled.Modal``;

export const DropdownBackdrop = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: -1000px;
  right: -1000px;
  bottom: -1000px;
  z-index: 1500;
  background-color: transparent;
`;

export const DropdownOverlay = styled.View`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 2000;
  background-color: transparent;
`;

export const DropdownList = styled.View`
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 4px 0;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 8;
  width: 100%;
`;

export const DropdownItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 10px 12px;
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.primary : 'transparent'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DropdownItemText = styled.Text<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) => 
    isSelected ? '#FFFFFF' : theme.text};
  font-size: 14px;
  font-weight: ${({ isSelected }) => isSelected ? '600' : '400'};
`;
