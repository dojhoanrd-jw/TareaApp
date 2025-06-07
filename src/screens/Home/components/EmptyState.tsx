import React from 'react';
import { FilterType } from '../../../components/FilterTasks';
import { DayFilter } from '../../../components/TasksHeader';
import { EmptyContainer, EmptyText } from '../styles';

interface EmptyStateProps {
  activeFilter: FilterType;
  selectedDay: DayFilter;
}

const DAYS_OPTIONS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

const EmptyState: React.FC<EmptyStateProps> = ({ activeFilter, selectedDay }) => {
  const getEmptyMessage = () => {
    if (activeFilter === 'all') {
      return selectedDay === 'all' 
        ? 'No tienes tareas creadas'
        : `No tienes tareas para ${DAYS_OPTIONS.find(d => d.key === selectedDay)?.label}`;
    }
    return activeFilter === 'completed'
      ? 'No tienes tareas completadas'
      : 'No tienes tareas en progreso';
  };

  return (
    <EmptyContainer>
      <EmptyText>{getEmptyMessage()}</EmptyText>
      {activeFilter === 'all' && selectedDay === 'all' && (
        <EmptyText>Presiona el botón + para crear tu primera tarea</EmptyText>
      )}
    </EmptyContainer>
  );
};

export default EmptyState;
