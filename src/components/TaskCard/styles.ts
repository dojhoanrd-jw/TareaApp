import styled from 'styled-components/native';

export const CardWrapper = styled.View`
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
`;

export const ActionsContainer = styled.View`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  width: 156px;
  z-index: 1;
`;

export const ActionButton = styled.TouchableOpacity<{ backgroundColor: string }>`
  width: 70px;
  height: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor};
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  border-radius: 8px;
`;

export const ActionText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-top: 4px;
`;

export const AnimatedCardContainer = styled.View`
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const CardContainer = styled.TouchableOpacity`
  padding: 16px;
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
  justify-content: flex-start;
  align-items: center;
`;

export const StatusBadge = styled.View<{ status?: string }>`
  background-color: ${({ status }) => {
    if (status === 'completed') return '#4CAF50';
    if (status === 'in-progress') return '#FF9800';
    return 'transparent';
  }};
  border-radius: 12px;
  padding: 4px 8px;
  margin-left: 8px;
`;

export const StatusText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: 600;
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
  flex-wrap: wrap;
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
