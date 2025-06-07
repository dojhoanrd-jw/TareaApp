import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from './src/styles/theme';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from './src/context/ThemeContext';
import AppNavigation from './src/navigation';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationService from './src/services/NotificationService';

enableScreens();

const AppContent = () => {
  const { isDarkMode } = useThemeContext();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Initialize notifications when app starts
    const initializeNotifications = async () => {
      try {
        await NotificationService.requestPermissions();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

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