import { useState } from 'react';
import { Alert } from 'react-native';
import UserService from '../services/UserService';
import { ValidationUtils } from '../utils/validation';

export const useUserRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (
    username: string,
    password: string,
    confirmPassword: string,
    onSuccess: () => void
  ) => {
    setIsLoading(true);

    try {
      const validation = ValidationUtils.validateRegistrationForm(username, password, confirmPassword);
      
      if (!validation.isValid) {
        Alert.alert('Error', validation.error);
        return;
      }

      const userData = { username: username.trim(), password };
      await UserService.saveUser(userData);
      
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      onSuccess();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};
