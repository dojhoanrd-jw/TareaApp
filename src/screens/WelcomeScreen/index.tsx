import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container, Title, Button, ButtonText } from './styles';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Container>
      <Title>Bienvenido a TareaApp</Title>

      <Button onPress={() => navigation.navigate('Login')}>
        <ButtonText>Iniciar Sesión</ButtonText>
      </Button>

      <Button onPress={() => navigation.navigate('Register')}>
        <ButtonText>Registrarse</ButtonText>
      </Button>
    </Container>
  );
}
