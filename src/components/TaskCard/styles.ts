import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const TaskTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 8px;
`;

export const TaskDescription = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 12px;
  line-height: 20px;
`;

export const TaskInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const TimeText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
`;

export const DaysContainer = styled.View`
  flex-direction: row;
  gap: 4px;
`;

export const DayChip = styled.View`
  background-color: ${({ theme }) => theme.primary};
  border-radius: 12px;
  padding: 4px 8px;
`;

export const DayText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;
