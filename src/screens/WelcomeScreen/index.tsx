import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import Button from '../../components/Button';
import {
  Container,
  BackgroundGradient,
  ContentContainer,
  TopSection,
  LogoContainer,
  LogoText,
  Title,
  Subtitle,
  FeaturesList,
  FeatureItem,
  FeatureIcon,
  FeatureText,
  BottomSection,
  ButtonContainer,
  WaveContainer,
  Wave,
} from './styles';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const features = [
  {
    icon: 'checkmark-circle-outline',
    text: 'Organiza tus tareas diarias de forma eficiente'
  },
  {
    icon: 'notifications-outline',
    text: 'Recibe recordatorios en el momento perfecto'
  },
  {
    icon: 'calendar-outline',
    text: 'Planifica tu semana con facilidad'
  },
  {
    icon: 'trending-up-outline',
    text: 'Mejora tu productividad día a día'
  }
];

export default function WelcomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme = useTheme();

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonsSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonsSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Container>
      <BackgroundGradient />
      <WaveContainer>
        <Wave />
      </WaveContainer>
      
      <ContentContainer>
        <TopSection>
          <Animated.View
            style={{
              transform: [{ scale: logoScaleAnim }],
            }}
          >
            <LogoContainer>
              <LogoText>TA</LogoText>
            </LogoContainer>
          </Animated.View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              alignItems: 'center',
            }}
          >
            <Title>Bienvenido a TareaApp</Title>
            <Subtitle>
              Tu compañero perfecto para{'\n'}
              organizar y completar tareas
            </Subtitle>

            <FeaturesList>
              {features.map((feature, index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + index * 10],
                        }),
                      },
                    ],
                  }}
                >
                  <FeatureItem>
                    <FeatureIcon>
                      <Ionicons 
                        name={feature.icon as any} 
                        size={20} 
                        color={theme.primary} 
                      />
                    </FeatureIcon>
                    <FeatureText>{feature.text}</FeatureText>
                  </FeatureItem>
                </Animated.View>
              ))}
            </FeaturesList>
          </Animated.View>
        </TopSection>

        <BottomSection>
          <Animated.View
            style={{
              transform: [{ translateY: buttonsSlideAnim }],
              opacity: fadeAnim,
            }}
          >
            <ButtonContainer>
              <Button text="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
              <Button text="Crear Cuenta" onPress={() => navigation.navigate('Register')} />
            </ButtonContainer>
          </Animated.View>
        </BottomSection>
      </ContentContainer>
    </Container>
  );
}
