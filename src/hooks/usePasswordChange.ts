import { useState } from 'react';
import { Alert } from 'react-native';
import UserService, { User } from '../services/UserService';
import { ValidationUtils } from '../utils/validation';

export const usePasswordChange = () => {
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    user: User,
    onSuccess: (updatedUser: User) => void
  ) => {
    setIsLoading(true);

    try {
      const validation = ValidationUtils.validatePasswordChangeForm(
        currentPassword,
        newPassword,
        confirmPassword
      );
      
      if (!validation.isValid) {
        Alert.alert('Error', validation.error);
        return;
      }

      const updatedUser = await UserService.updatePassword(currentPassword, newPassword, user);
      
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      onSuccess(updatedUser);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    changePassword,
    isLoading
  };
};
