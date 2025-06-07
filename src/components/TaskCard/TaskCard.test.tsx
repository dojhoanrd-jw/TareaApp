import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TaskCard from './index';

describe('TaskCard', () => {
  const baseProps = {
    id: '1',
    title: 'Tarea de prueba',
    description: 'Descripción',
    days: ['monday'],
    startTime: '09:00',
    endTime: '10:00',
    user: 'testuser',
    status: 'in-progress' as const,
    notificationsEnabled: true,
    onPress: jest.fn(),
    onDelete: jest.fn(),
    onToggleStatus: jest.fn(),
    onToggleNotifications: jest.fn(),
  };

  it('renderiza el título', () => {
    const { getByText } = render(<TaskCard {...baseProps} />);
    expect(getByText('Tarea de prueba')).toBeTruthy();
  });

  it('llama a onPress cuando se presiona', () => {
    const { getByText } = render(<TaskCard {...baseProps} />);
    fireEvent.press(getByText('Tarea de prueba'));
    expect(baseProps.onPress).toHaveBeenCalled();
  });
});
