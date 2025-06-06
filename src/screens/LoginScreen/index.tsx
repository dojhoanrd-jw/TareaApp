import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { Container, Title, LinkText } from './styles';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@user');
      if (!storedUser) {
        return Alert.alert('Error', 'No hay usuario registrado');
      }

      const parsed = JSON.parse(storedUser);
      if (parsed.username === username && parsed.password === password) {
        login(parsed);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
      console.error(error);
    }
  };

  return (
    <Container>
      <Title>Iniciar Sesión</Title>
      <Input placeholder="Usuario" value={username} onChangeText={setUsername} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Button text="Entrar" onPress={handleLogin} />

      <LinkText onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </LinkText>
    </Container>
  );
}