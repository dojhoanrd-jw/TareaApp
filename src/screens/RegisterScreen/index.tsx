import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container, LogoContainer, LogoText, Title, LinkText } from './styles';
import { useUserRegistration } from '../../hooks/useUserRegistration';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { registerUser, isLoading } = useUserRegistration();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    await registerUser(username, password, confirmPassword, () => {
      navigation.navigate('Login');
    });
  };

  return (
    <Container>
      <LogoContainer>
        <LogoText>TA</LogoText>
      </LogoContainer>
      
      <Title>Crear Cuenta</Title>

      <Input placeholder="Usuario" value={username} onChangeText={setUsername} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Confirmar contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Button 
        text={isLoading ? "Registrando..." : "Registrarse"} 
        onPress={handleRegister}
        disabled={isLoading}
      />

      <LinkText onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </LinkText>
    </Container>
  );
}
