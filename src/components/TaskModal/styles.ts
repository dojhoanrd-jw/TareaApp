import styled from 'styled-components/native';

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.background};
  margin: 20px;
  border-radius: 16px;
  padding: 10px 20px 10px 20px;
  width: 90%;
  max-height: 80%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

export const CloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const ScrollContainer = styled.ScrollView`
  max-height: 400px;
`;

export const FormSection = styled.View`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

export const DaysContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const DayButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, isSelected }) => 
    isSelected ? theme.primary : theme.background};
  border: 2px solid ${({ theme, isSelected }) => 
    isSelected ? theme.primary : '#E0E0E0'};
  shadow-color: ${({ isSelected }) => isSelected ? '#000' : 'transparent'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ isSelected }) => isSelected ? 0.1 : 0};
  shadow-radius: 4px;
  elevation: ${({ isSelected }) => isSelected ? 2 : 0};
`;

export const DayText = styled.Text<{ isSelected: boolean }>`
  color: ${({ theme, isSelected }) => 
    isSelected ? '#FFFFFF' : theme.text};
  font-weight: ${({ isSelected }) => isSelected ? 'bold' : '600'};
  font-size: 16px;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 12px;
`;

export const TimeSection = styled.View`
  flex: 1;
`;

export const TimeInput = styled.TextInput`
  height: 44px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 0 12px;
  font-size: 16px;
  text-align: center;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

export const SmallButton = styled.View`
  flex: 0.40;
`;
