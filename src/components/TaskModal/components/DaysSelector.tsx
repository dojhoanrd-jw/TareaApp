import React from 'react';
import { DaysContainer, DayButton, DayText } from '../styles';

interface DaysSelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
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

const DaysSelector: React.FC<DaysSelectorProps> = ({
  selectedDays,
  onDayToggle,
}) => {
  return (
    <DaysContainer>
      {DAYS_OF_WEEK.map(day => (
        <DayButton
          key={day.key}
          isSelected={selectedDays.includes(day.key)}
          onPress={() => onDayToggle(day.key)}
        >
          <DayText isSelected={selectedDays.includes(day.key)}>
            {day.label}
          </DayText>
        </DayButton>
      ))}
    </DaysContainer>
  );
};

export default DaysSelector;
