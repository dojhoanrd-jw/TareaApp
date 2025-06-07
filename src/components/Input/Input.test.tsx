import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from './index';

describe('Input', () => {
  it('renderiza el placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Usuario" value="" onChangeText={() => {}} />);
    expect(getByPlaceholderText('Usuario')).toBeTruthy();
  });

  it('llama a onChangeText al escribir', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(<Input placeholder="Test" value="" onChangeText={onChangeTextMock} />);
    fireEvent.changeText(getByPlaceholderText('Test'), 'nuevo valor');
    expect(onChangeTextMock).toHaveBeenCalledWith('nuevo valor');
  });
});
