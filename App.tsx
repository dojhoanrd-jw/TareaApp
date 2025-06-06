import React from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from './src/styles/theme';
import AppNavigation from './src/navigation'; 
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';

enableScreens();

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigation />
    </ThemeProvider>
  );
}
