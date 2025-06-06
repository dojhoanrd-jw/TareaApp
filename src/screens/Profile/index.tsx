import React, { useState } from 'react';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Container, BackButton, BackButtonText, Content, Avatar, Name, TopSection, BottomSection, ThemeContainer, ThemeLabel } from './styles';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation';
import { useTheme } from 'styled-components/native';
import PasswordChangeForm from '../../components/PasswordChangeForm';
import { useThemeContext } from '../../context/ThemeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  const handleThemeToggle = (value: boolean) => {
    toggleTheme();
  };

  return (
    <Container>
      <BackButton onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={20} color={theme.text} />
        <BackButtonText>Atrás</BackButtonText>
      </BackButton>
      
      <Content>
        <TopSection>
          <Avatar source={require('../../../assets/user.png')} />
          <Name>{user?.username || 'Usuario'}</Name>
        </TopSection>
        
        <PasswordChangeForm />
        
        <ThemeContainer>
          <ThemeLabel>Tema de preferencia</ThemeLabel>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
          />
        </ThemeContainer>
        
        <BottomSection>
          <Button text="Cerrar sesión" onPress={handleLogout} />
        </BottomSection>
      </Content>
    </Container>
  );
};

export default ProfileScreen;