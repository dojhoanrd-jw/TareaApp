import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { TaskData } from '../context/TaskContext';
import { TaskValidationService } from '../services/TaskValidationService';

interface UseTaskFormProps {
  editTask?: TaskData;
  isEditMode?: boolean;
  onSubmit: (task: TaskData) => void;
  user?: { username: string } | null;
}

export const useTaskForm = ({ editTask, isEditMode = false, onSubmit, user }: UseTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const validationService = new TaskValidationService();

  useEffect(() => {
    if (isEditMode && editTask) {
      setTitle(editTask.title || '');
      setDescription(editTask.description || '');
      setSelectedDays(editTask.days ? [...editTask.days] : []);
      setStartTime(editTask.startTime || '09:00');
      setEndTime(editTask.endTime || '17:00');
      setNotificationsEnabled(editTask.notificationsEnabled !== false);
    } else {
      resetForm();
    }
  }, [isEditMode, editTask?.id]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('17:00');
    setNotificationsEnabled(true);
  };

  const toggleDay = (dayKey: string) => {
    setSelectedDays(prev => 
      prev.includes(dayKey) 
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const formatTimeInput = (text: string, setter: (value: string) => void) => {
    let cleaned = text.replace(/[^\d:]/g, '');
    
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      cleaned += ':';
    }
    
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5);
    }

    setter(cleaned);
  };

  const handleSubmit = () => {
    if (!user?.username) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const validation = validationService.validateTask({
      title,
      days: selectedDays,
      startTime,
      endTime,
    });

    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    const taskData: TaskData = {
      id: isEditMode && editTask ? editTask.id : Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      days: selectedDays,
      startTime,
      endTime,
      user: user.username,
      status: isEditMode && editTask ? editTask.status : undefined,
      notificationsEnabled,
    };

    onSubmit(taskData);
  };

  return {
    // State
    title,
    description,
    selectedDays,
    startTime,
    endTime,
    notificationsEnabled,
    
    // Actions
    setTitle,
    setDescription,
    setSelectedDays,
    setStartTime,
    setEndTime,
    setNotificationsEnabled,
    toggleDay,
    formatTimeInput,
    handleSubmit,
    resetForm,
  };
};
