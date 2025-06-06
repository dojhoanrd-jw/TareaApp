import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useAuth } from '../../context/AuthContext';
import { TaskData } from '../../context/TaskContext';
import Input from '../Input';
import Button from '../Button';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ScrollContainer,
  FormSection,
  SectionTitle,
  DaysContainer,
  DayButton,
  DayText,
  TimeContainer,
  TimeSection,
  TimeInput,
  ButtonContainer,
  SmallButton,
} from './styles';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (task: TaskData) => void;
  editTask?: TaskData;
  isEditMode?: boolean;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'L' },
  { key: 'tuesday', label: 'M' },
  { key: 'wednesday', label: 'M' },
  { key: 'thursday', label: 'J' },
  { key: 'friday', label: 'V' },
  { key: 'saturday', label: 'S' },
  { key: 'sunday', label: 'D' },
];

const TaskModal: React.FC<TaskModalProps> = ({ 
  visible, 
  onClose, 
  onCreateTask, 
  editTask,
  isEditMode = false 
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [status, setStatus] = useState<'completed' | 'in-progress' | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      if (isEditMode && editTask) {
        console.log('Loading edit task:', editTask); 
        setTitle(editTask.title || '');
        setDescription(editTask.description || '');
        setSelectedDays(editTask.days ? [...editTask.days] : []);
        setStartTime(editTask.startTime || '09:00');
        setEndTime(editTask.endTime || '17:00');
        setStatus(editTask.status);
      } else {
        console.log('Clearing form for new task');
        setTitle('');
        setDescription('');
        setSelectedDays([]);
        setStartTime('09:00');
        setEndTime('17:00');
        setStatus(undefined);
      }
    }
  }, [visible, isEditMode, editTask?.id]);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('17:00');
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const toggleDay = useCallback((dayKey: string) => {
    setSelectedDays(prev => 
      prev.includes(dayKey) 
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    );
  }, []);

  const validateTime = (time: string): boolean => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título de la tarea es obligatorio');
      return false;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un día');
      return false;
    }

    if (!validateTime(startTime) || !validateTime(endTime)) {
      Alert.alert('Error', 'Las horas deben tener formato HH:MM válido');
      return false;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    if (startH * 60 + startM >= endH * 60 + endM) {
      Alert.alert('Error', 'La hora de inicio debe ser anterior a la hora de fin');
      return false;
    }

    return true;
  };

  const handleCreateTask = useCallback(() => {
    if (!validateForm() || !user) return;

    const taskData: TaskData = {
      id: isEditMode && editTask ? editTask.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      days: selectedDays,
      startTime: startTime,
      endTime: endTime,
      user: user.username,
      status: status,
    };

    onCreateTask(taskData);
  }, [title, description, selectedDays, startTime, endTime, status, user, onCreateTask, isEditMode, editTask, validateForm]);

  const formatTimeInput = (text: string, setter: (value: string) => void) => {
    let cleaned = text.replace(/[^\d:]/g, '');
    
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      cleaned += ':';
    }
    
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5);
    }

    setter(cleaned);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</ModalTitle>
              <CloseButton onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </CloseButton>
            </ModalHeader>

            <ScrollContainer 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormSection>
                <SectionTitle>Título</SectionTitle>
                <Input
                  placeholder="Nombre de la tarea"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={50}
                />
              </FormSection>

              <FormSection>
                <SectionTitle>Descripción</SectionTitle>
                <Input
                  placeholder="Descripción (opcional)"
                  value={description}
                  onChangeText={setDescription}
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
                <DaysContainer>
                  {DAYS_OF_WEEK.map(day => (
                    <DayButton
                      key={day.key}
                      isSelected={selectedDays.includes(day.key)}
                      onPress={() => toggleDay(day.key)}
                    >
                      <DayText isSelected={selectedDays.includes(day.key)}>
                        {day.label}
                      </DayText>
                    </DayButton>
                  ))}
                </DaysContainer>
              </FormSection>

              <FormSection>
                <SectionTitle>Estado de la tarea</SectionTitle>
                <DaysContainer>
                  <DayButton
                    isSelected={status === undefined}
                    onPress={() => setStatus(undefined)}
                  >
                    <DayText isSelected={status === undefined}>Sin estado</DayText>
                  </DayButton>
                  <DayButton
                    isSelected={status === 'in-progress'}
                    onPress={() => setStatus('in-progress')}
                  >
                    <DayText isSelected={status === 'in-progress'}>En progreso</DayText>
                  </DayButton>
                  <DayButton
                    isSelected={status === 'completed'}
                    onPress={() => setStatus('completed')}
                  >
                    <DayText isSelected={status === 'completed'}>Completada</DayText>
                  </DayButton>
                </DaysContainer>
              </FormSection>

              <FormSection>
                <TimeContainer>
                  <TimeSection>
                    <SectionTitle>Hora de inicio</SectionTitle>
                    <TimeInput
                      value={startTime}
                      onChangeText={(text) => formatTimeInput(text, setStartTime)}
                      placeholder="09:00"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </TimeSection>

                  <TimeSection>
                    <SectionTitle>Hora de fin</SectionTitle>
                    <TimeInput
                      value={endTime}
                      onChangeText={(text) => formatTimeInput(text, setEndTime)}
                      placeholder="17:00"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={5}
                    />
                  </TimeSection>
                </TimeContainer>
              </FormSection>
            </ScrollContainer>

            <ButtonContainer>
              <SmallButton>
                <Button text="Cancelar" onPress={handleClose} />
              </SmallButton>
              <SmallButton>
                <Button text={isEditMode ? 'Guardar' : 'Crear Tarea'} onPress={handleCreateTask} />
              </SmallButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TaskModal;
