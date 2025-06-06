import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  HeaderContainer,
  Title,
  DropdownContainer,
  DropdownButton,
  DropdownText,
  DropdownBackdrop,
  DropdownOverlay,
  DropdownList,
  DropdownItem,
  DropdownItemText,
} from './styles';

export type DayFilter = 'all' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface TasksHeaderProps {
  selectedDay: DayFilter;
  onDayChange: (day: DayFilter) => void;
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

const getCurrentDay = (): DayFilter => {
  const dayIndex = new Date().getDay();
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return dayMap[dayIndex] as DayFilter;
};

const TasksHeader: React.FC<TasksHeaderProps> = ({
  selectedDay,
  onDayChange,
}) => {
  const theme = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Set today as default when component mounts
    const today = getCurrentDay();
    onDayChange(today);
  }, []);

  const handleDaySelect = (day: DayFilter) => {
    onDayChange(day);
    setIsDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const getSelectedDayLabel = () => {
    const selectedOption = DAYS_OPTIONS.find(option => option.key === selectedDay);
    return selectedOption?.label || 'Lunes';
  };

  return (
    <HeaderContainer>
      <Title>Lista de tareas</Title>
      
      <DropdownContainer>
        <DropdownButton onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
          <DropdownText>{getSelectedDayLabel()}</DropdownText>
          <Ionicons 
            name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={theme.text} 
          />
        </DropdownButton>

        {isDropdownOpen && (
          <>
            <DropdownBackdrop onPress={closeDropdown} />
            <DropdownOverlay>
              <DropdownList>
                {DAYS_OPTIONS.map((option) => (
                  <DropdownItem
                    key={option.key}
                    isSelected={selectedDay === option.key}
                    onPress={() => handleDaySelect(option.key as DayFilter)}
                  >
                    <DropdownItemText isSelected={selectedDay === option.key}>
                      {option.label}
                    </DropdownItemText>
                    {selectedDay === option.key && (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    )}
                  </DropdownItem>
                ))}
              </DropdownList>
            </DropdownOverlay>
          </>
        )}
      </DropdownContainer>
    </HeaderContainer>
  );
};

export default TasksHeader;
