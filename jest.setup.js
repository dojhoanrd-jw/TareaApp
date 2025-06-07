import 'react-native-gesture-handler/jestSetup';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    manifest: {
      extra: {},
    },
  },
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  addNotificationResponseListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  addNotificationReceivedListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  setNotificationHandler: jest.fn(),
}));

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock styled-components
jest.mock('styled-components/native', () => {
  const React = require('react');
  
  const styled = (Component) => (template) => (props) => {
    // For TextInput, preserve important props
    if (Component === 'TextInput') {
      return React.createElement('TextInput', {
        ...props,
        placeholder: props.placeholder,
        value: props.value,
        onChangeText: props.onChangeText,
        secureTextEntry: props.secureTextEntry,
      }, props.children);
    }
    
    // For TouchableOpacity, preserve onPress and disabled
    if (Component === 'TouchableOpacity') {
      const handlePress = (event) => {
        // Don't call onPress if disabled
        if (!props.disabled && props.onPress) {
          props.onPress(event);
        }
      };
      
      return React.createElement('TouchableOpacity', {
        ...props,
        onPress: handlePress,
        disabled: props.disabled,
        activeOpacity: props.activeOpacity,
      }, props.children);
    }
    
    // For Text, preserve the text content
    if (Component === 'Text') {
      return React.createElement('Text', props, props.children);
    }
    
    // For other components, render as View but preserve children
    return React.createElement('View', props, props.children);
  };

  // Mock all styled components
  styled.View = styled('View');
  styled.Text = styled('Text');
  styled.TouchableOpacity = styled('TouchableOpacity');
  styled.ScrollView = styled('ScrollView');
  styled.TextInput = styled('TextInput');

  return {
    __esModule: true,
    default: styled,
    useTheme: jest.fn(() => ({
      primary: '#1e90ff',
      background: '#ffffff',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0',
      inputBackground: '#f5f5f5',
    })),
  };
});

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useFocusEffect: jest.fn(),
}));

// Mock context providers
jest.mock('./src/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: { username: 'testuser' },
    login: jest.fn(),
    logout: jest.fn(),
  })),
}));

jest.mock('./src/context/TaskContext', () => ({
  useTask: jest.fn(() => ({
    tasks: [],
    getUserTasks: jest.fn(() => []),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    isLoading: false,
  })),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock hooks that might be causing issues
jest.mock('./src/hooks/useTaskCard', () => ({
  useTaskCard: jest.fn(() => ({
    pan: new Proxy({}, {
      get: () => 0,
      set: () => true,
    }),
    panResponder: { panHandlers: {} },
    resetPosition: jest.fn(),
    actions: [
      {
        backgroundColor: '#FF6B6B',
        icon: 'trash',
        text: 'Eliminar',
        action: jest.fn(),
      },
    ],
  })),
}));

jest.mock('./src/hooks/useSwipeGesture', () => ({
  useSwipeGesture: jest.fn(() => ({
    pan: new Proxy({}, {
      get: () => 0,
      set: () => true,
    }),
    panResponder: { panHandlers: {} },
    resetPosition: jest.fn(),
  })),
}));

jest.mock('./src/hooks/useErrorHandler', () => ({
  useErrorHandler: jest.fn(() => ({
    handleError: jest.fn(),
    handleAsyncError: jest.fn(),
    showValidationError: jest.fn(),
  })),
}));

// Mock all utils and services
jest.mock('./src/utils/ErrorHandler', () => ({
  ErrorType: {
    VALIDATION: 'VALIDATION',
    NETWORK: 'NETWORK',
    STORAGE: 'STORAGE',
    AUTHENTICATION: 'AUTHENTICATION',
    NOTIFICATION: 'NOTIFICATION',
    TASK: 'TASK',
    UNKNOWN: 'UNKNOWN',
  },
  AppError: jest.fn().mockImplementation((message, type) => ({
    message,
    type,
    name: 'AppError',
  })),
  errorHandler: {
    handleError: jest.fn(),
    logError: jest.fn(),
  },
}));

// Global test environment setup
global.__DEV__ = true;

// Silence console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
