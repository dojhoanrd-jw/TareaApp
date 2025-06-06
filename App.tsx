import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from './src/styles/theme';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from './src/context/ThemeContext';
import AppNavigation from './src/navigation';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

enableScreens();

const AppContent = () => {
  const { isDarkMode } = useThemeContext();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigation />
      </SafeAreaView>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}