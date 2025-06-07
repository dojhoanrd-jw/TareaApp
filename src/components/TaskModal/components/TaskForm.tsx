import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from 'styled-components/native';
import Input from '../../Input';
import DaysSelector from './DaysSelector';
import TimeInputSection from './TimeInputSection';
import {
  FormSection,
  SectionTitle,
  TimeContainer,
} from '../styles';

interface TaskFormProps {
  title: string;
  description: string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  notificationsEnabled: boolean;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onDayToggle: (day: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onNotificationsToggle: (enabled: boolean) => void;
  formatTimeInput: (text: string, setter: (time: string) => void) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  description,
  selectedDays,
  startTime,
  endTime,
  notificationsEnabled,
  onTitleChange,
  onDescriptionChange,
  onDayToggle,
  onStartTimeChange,
  onEndTimeChange,
  onNotificationsToggle,
  formatTimeInput,
}) => {
  const theme = useTheme();

  return (
    <>
      <FormSection>
        <SectionTitle>Título</SectionTitle>
        <Input
          placeholder="Nombre de la tarea"
          value={title}
          onChangeText={onTitleChange}
          maxLength={50}
        />
      </FormSection>

      <FormSection>
        <SectionTitle>Descripción</SectionTitle>
        <Input
          placeholder="Descripción (opcional)"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          textAlignVertical="top"
          scrollEnabled={false}
          style={{ 
            minHeight: 80,
            height: Math.max(80, description.split('\n').length * 20 + 40)
          }}
          maxLength={200}
        />
      </FormSection>

      <FormSection>
        <SectionTitle>Días de la semana</SectionTitle>
        <DaysSelector
          selectedDays={selectedDays}
          onDayToggle={onDayToggle}
        />
      </FormSection>

      <FormSection>
        <TimeInputSection
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={onStartTimeChange}
          onEndTimeChange={onEndTimeChange}
          formatTimeInput={formatTimeInput}
        />
      </FormSection>

      <FormSection>
        <SectionTitle>Configuración</SectionTitle>
        <TimeContainer>
          <SectionTitle style={{ flex: 1, marginBottom: 0 }}>
            Notificaciones
          </SectionTitle>
          <Switch
            value={notificationsEnabled}
            onValueChange={onNotificationsToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </TimeContainer>
      </FormSection>
    </>
  );
};

export default TaskForm;
