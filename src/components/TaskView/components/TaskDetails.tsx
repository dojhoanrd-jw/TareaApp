import React from 'react';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { TaskData } from '../../../context/TaskContext';
import {
  Section,
  SectionTitle,
  SectionContent,
  DaysContainer,
  DayChip,
  DayText,
  TimeContainer,
  TimeText,
} from '../styles';

interface TaskDetailsProps {
  task: TaskData;
}

const DAYS_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  const theme = useTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
      <Section>
        <SectionTitle>Título</SectionTitle>
        <SectionContent>{task.title}</SectionContent>
      </Section>

      {task.description && (
        <Section>
          <SectionTitle>Descripción</SectionTitle>
          <SectionContent>{task.description}</SectionContent>
        </Section>
      )}

      <Section>
        <SectionTitle>Días de la semana</SectionTitle>
        <DaysContainer>
          {task.days.map((day, index) => (
            <DayChip key={index}>
              <DayText>{DAYS_NAMES[day as keyof typeof DAYS_NAMES]}</DayText>
            </DayChip>
          ))}
        </DaysContainer>
      </Section>

      <Section>
        <SectionTitle>Horario</SectionTitle>
        <TimeContainer>
          <Ionicons name="time-outline" size={20} color={theme.primary} />
          <TimeText>{task.startTime} - {task.endTime}</TimeText>
        </TimeContainer>
      </Section>
    </ScrollView>
  );
};

export default TaskDetails;
