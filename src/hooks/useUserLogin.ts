import { useState } from 'react';
import { Alert } from 'react-native';
import UserService from '../services/UserService';
import { ValidationUtils } from '../utils/validation';

export const useUserLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (
    username: string,
    password: string,
    onSuccess: (userData: any) => void
  ) => {
    setIsLoading(true);

    try {
      const usernameValidation = ValidationUtils.validateRequired(username, 'Usuario');
      if (!usernameValidation.isValid) {
        Alert.alert('Error', usernameValidation.error);
        return;
      }

      const passwordValidation = ValidationUtils.validateRequired(password, 'Contraseña');
      if (!passwordValidation.isValid) {
        Alert.alert('Error', passwordValidation.error);
        return;
      }

      const userData = await UserService.validateLogin(username, password);
      onSuccess(userData);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Hubo un problema al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginUser,
    isLoading
  };
};
