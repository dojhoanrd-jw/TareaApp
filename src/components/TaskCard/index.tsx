import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  CardContainer,
  TaskTitle,
  TaskDescription,
  TaskInfo,
  TimeContainer,
  TimeText,
  DaysContainer,
  DayChip,
  DayText,
} from './styles';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string; 
  onPress?: () => void;
}

const DAYS_MAP = {
  monday: 'L',
  tuesday: 'M',
  wednesday: 'M',
  thursday: 'J',
  friday: 'V',
  saturday: 'S',
  sunday: 'D',
};

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  days,
  startTime,
  endTime,
  user, 
  onPress,
}) => {
  const theme = useTheme();

  return (
    <CardContainer onPress={onPress}>
      <TaskTitle>{title}</TaskTitle>
      
      {description && (
        <TaskDescription>{description}</TaskDescription>
      )}

      <TaskInfo>
        <TimeContainer>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <TimeText>{startTime} - {endTime}</TimeText>
        </TimeContainer>

        <DaysContainer>
          {days.map((day, index) => (
            <DayChip key={index}>
              <DayText>{DAYS_MAP[day as keyof typeof DAYS_MAP]}</DayText>
            </DayChip>
          ))}
        </DaysContainer>
      </TaskInfo>
    </CardContainer>
  );
};

export default TaskCard;
