import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { Container, LogoContainer, LogoText, Title, LinkText } from './styles';
import { useUserLogin } from '../../hooks/useUserLogin';

type RootStackParamList = {
  Home: undefined;
  Register: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { login } = useAuth();
  const { loginUser, isLoading } = useUserLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await loginUser(username, password, (userData) => {
      login(userData);
      navigation.navigate('Home');
    });
  };

  return (
    <Container>
      <LogoContainer>
        <LogoText>TA</LogoText>
      </LogoContainer>
      
      <Title>Iniciar Sesión</Title>
      <Input placeholder="Usuario" value={username} onChangeText={setUsername} />
      <Input placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      <Button 
        text={isLoading ? "Entrando..." : "Entrar"} 
        onPress={handleLogin}
        disabled={isLoading}
      />

      <LinkText onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </LinkText>
    </Container>
  );
}