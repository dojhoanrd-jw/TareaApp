import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container, Title, ProfileButton } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Header = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <Container>
      <Title>TareaApp</Title>
      <ProfileButton 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Ionicons name="person-circle-outline" size={28} color="#fff" />
      </ProfileButton>
    </Container>
  );
};

export default Header;