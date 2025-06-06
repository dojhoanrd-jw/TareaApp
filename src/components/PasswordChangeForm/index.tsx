import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../Input';
import Button from '../Button';
import { useAuth } from '../../context/AuthContext';
import { Container, Title } from './styles';

interface PasswordChangeFormProps {
  onPasswordChanged?: () => void;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onPasswordChanged }) => {
  const { user, login } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswords = (): boolean => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }

    if (currentPassword !== user?.password) {
      Alert.alert('Error', 'La contraseña actual es incorrecta');
      return false;
    }

    if (newPassword === currentPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return false;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswords() || !user) return;

    setIsLoading(true);

    try {
      const updatedUser = { ...user, password: newPassword };
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      login(updatedUser);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      onPasswordChanged?.();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
