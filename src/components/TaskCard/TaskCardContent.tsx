import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  TaskTitle,
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

// Order of days in the week
const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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

  // Sort days according to weekly order
  const sortedDays = days.sort((a, b) => {
    return DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b);
  });

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

      {/* Days moved below title */}
      <DaysContainer style={{ marginBottom: 8 }}>
        {sortedDays.map((day, index) => (
          <DayChip key={index}>
            <DayText>{DAYS_MAP[day as keyof typeof DAYS_MAP]}</DayText>
          </DayChip>
        ))}
      </DaysContainer>

      <TaskInfo style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <TimeContainer>
          <Ionicons name="time-outline" size={16} color={theme.primary} />
          <TimeText>
            {startTime} - {endTime}
          </TimeText>
        </TimeContainer>
        {status && (
          <StatusBadge status={status}>
            <StatusText>
              {status === 'completed' ? 'Completada' : 'En progreso'}
            </StatusText>
          </StatusBadge>
        )}
      </TaskInfo>
    </>
  );
};

export default TaskCardContent;
