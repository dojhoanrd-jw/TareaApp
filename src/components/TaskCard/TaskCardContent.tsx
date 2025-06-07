import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  TaskTitle,
  TaskDescription,
  TaskInfo,
  TimeContainer,
  TimeText,
  DaysContainer,
  DayChip,
  DayText,
  StatusBadge,
  StatusText,
} from './styles';

interface TaskCardContentProps {
  title: string;
  description?: string;
  days: string[];
  startTime: string;
  endTime: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
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

const TaskCardContent: React.FC<TaskCardContentProps> = ({
  title,
  description,
  days,
  startTime,
  endTime,
  status,
  notificationsEnabled,
}) => {
  const theme = useTheme();

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <TaskTitle style={{ flex: 1 }}>{title}</TaskTitle>
        {notificationsEnabled && (
          <Ionicons 
            name="notifications" 
            size={16} 
            color={theme.primary} 
            style={{ marginLeft: 8 }}
          />
        )}
      </View>

      {description && (
        <TaskDescription>{description}</TaskDescription>
      )}

      <TaskInfo>
        <TimeContainer>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <TimeText>
            {startTime} - {endTime}
          </TimeText>
          {status && (
            <StatusBadge status={status}>
              <StatusText>
                {status === 'completed' ? 'Completada' : 'En progreso'}
              </StatusText>
            </StatusBadge>
          )}
        </TimeContainer>

        <DaysContainer>
          {days.map((day, index) => (
            <DayChip key={index}>
              <DayText>{DAYS_MAP[day as keyof typeof DAYS_MAP]}</DayText>
            </DayChip>
          ))}
        </DaysContainer>
      </TaskInfo>
    </>
  );
};

export default TaskCardContent;
