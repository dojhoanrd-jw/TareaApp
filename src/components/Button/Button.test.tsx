import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './index';

describe('Button', () => {
  it('muestra el texto correctamente', () => {
    const { getByText } = render(<Button text="Hola" onPress={() => {}} />);
    expect(getByText('Hola')).toBeTruthy();
  });

  it('llama a onPress cuando se presiona', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button text="Click" onPress={onPressMock} />);
    fireEvent.press(getByText('Click'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('está deshabilitado cuando disabled=true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button text="Disabled" onPress={onPressMock} disabled />);
    const button = getByText('Disabled');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
