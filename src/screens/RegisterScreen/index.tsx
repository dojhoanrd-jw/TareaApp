import React, { useState } from 'react';
import { Alert } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container, Title, LinkText } from './styles';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      return Alert.alert('Error', 'Todos los campos son obligatorios');
    }

    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    const userData = { username, password };

    try {
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el usuario');
      console.error(error);
    }
  };

  return (
    <Container>
      <Title>Crear Cuenta</Title>

      <Input placeholder="Usuario" value={username} onChangeText={setUsername} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Button text="Registrarse" onPress={handleRegister} />

      <LinkText onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </LinkText>
    </Container>
  );
}
