import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container, Title } from './styles';
import Button from '../../components/Button';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Container>
      <Title>Bienvenido a TareaApp</Title>

      <Button text="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
      <Button text="Registrarse" onPress={() => navigation.navigate('Register')} />
    </Container>
  );
}
