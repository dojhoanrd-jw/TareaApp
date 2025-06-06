import React from 'react';
import { StyledButton, ButtonText } from './styles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function Button({ text, onPress, disabled = false }: ButtonProps) {
  return (
    <StyledButton onPress={onPress} disabled={disabled}>
      <ButtonText>{text}</ButtonText>
    </StyledButton>
  );
}
