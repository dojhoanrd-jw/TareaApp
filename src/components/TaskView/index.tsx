import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import Button from '../Button';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ScrollContainer,
  Section,
  SectionTitle,
  SectionContent,
  DaysContainer,
  DayChip,
  DayText,
  TimeContainer,
  TimeText,
  ButtonContainer,
  ActionButton,
} from './styles';

interface TaskData {
  id: string;
  title: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string;
}

interface TaskViewProps {
  visible: boolean;
  task: TaskData | null;
  onClose: () => void;
  onEdit: (task: TaskData) => void;
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

const TaskView: React.FC<TaskViewProps> = ({ visible, task, onClose, onEdit }) => {
  const theme = useTheme();

  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Detalles de Tarea</ModalTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </CloseButton>
          </ModalHeader>

          <ScrollContainer showsVerticalScrollIndicator={false}>
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

            <Section>
              <SectionTitle>Creado por</SectionTitle>
              <SectionContent>{task.user}</SectionContent>
            </Section>
          </ScrollContainer>

          <ButtonContainer>
            <ActionButton>
              <Button text="Cerrar" onPress={onClose} />
            </ActionButton>
            <ActionButton>
              <Button text="Editar Tarea" onPress={handleEdit} />
            </ActionButton>
          </ButtonContainer>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default TaskView;
