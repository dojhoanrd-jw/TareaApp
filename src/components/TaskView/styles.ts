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
  padding: 20px;
  width: 90%;
  max-height: 80%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

export const Section = styled.View`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

export const SectionContent = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 22px;
`;

export const DaysContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const DayChip = styled.View`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 16px;
  padding: 8px 12px;
`;

export const DayText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TimeText = styled.Text`
  font-size: 15px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  gap: 12px;
`;

export const ActionButton = styled.View`
  flex: 1;
`;
