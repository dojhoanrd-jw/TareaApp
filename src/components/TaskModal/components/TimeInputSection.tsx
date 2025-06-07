import React from 'react';
import { TimeContainer, TimeSection, TimeInput, SectionTitle } from '../styles';

interface TimeInputSectionProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  formatTimeInput: (text: string, setter: (time: string) => void) => void;
}

const TimeInputSection: React.FC<TimeInputSectionProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  formatTimeInput,
}) => {
  return (
    <TimeContainer>
      <TimeSection>
        <SectionTitle>Hora de inicio</SectionTitle>
        <TimeInput
          value={startTime}
          onChangeText={(text) => formatTimeInput(text, onStartTimeChange)}
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
          onChangeText={(text) => formatTimeInput(text, onEndTimeChange)}
          placeholder="17:00"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={5}
        />
      </TimeSection>
    </TimeContainer>
  );
};

export default TimeInputSection;
