import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePasswordChange } from './usePasswordChange';

export const usePasswordChangeForm = (onPasswordChanged?: () => void) => {
  const { user, login } = useAuth();
  const { changePassword, isLoading } = usePasswordChange();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = async () => {
    if (!user) return;

    await changePassword(currentPassword, newPassword, confirmPassword, user, (updatedUser) => {
      login(updatedUser);
      resetForm();
      onPasswordChanged?.();
    });
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return {
    // Form state
    currentPassword,
    newPassword,
    confirmPassword,
    isLoading,
    
    // Form actions
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handlePasswordChange,
    resetForm,
  };
};
