import React from 'react';
import Input from '../Input';
import Button from '../Button';
import { Container, Title } from './styles';
import { usePasswordChangeForm } from '../../hooks/usePasswordChangeForm';

interface PasswordChangeFormProps {
  onPasswordChanged?: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onPasswordChanged }) => {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    isLoading,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handlePasswordChange,
  } = usePasswordChangeForm(onPasswordChanged);

  return (
    <Container>
      <Title>Cambiar Contraseña</Title>
      
      <Input 
        placeholder="Contraseña actual" 
        value={currentPassword} 
        onChangeText={setCurrentPassword} 
        secureTextEntry 
      />
      
      <Input 
        placeholder="Nueva contraseña" 
        value={newPassword} 
        onChangeText={setNewPassword} 
        secureTextEntry 
      />
      
      <Input 
        placeholder="Confirmar nueva contraseña" 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
      />
      
      <Button 
        text={isLoading ? "Cambiando..." : "Cambiar Contraseña"} 
        onPress={handlePasswordChange}
        disabled={isLoading}
      />
    </Container>
  );
};

export default PasswordChangeForm;
