global.__reanimatedWorkletInit = () => {};
global.ReanimatedDataMock = {
  now: () => Date.now(),
};

jest.mock('react-native-worklets', () => ({
  Worklets: {
    createRunInContext: jest.fn(),
    createContext: jest.fn(),
  },
  createSerializable: jest.fn((v) => v),
  isWorklet: jest.fn(() => false),
}));

import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Manual mock for Reanimated to avoid initialization issues
jest.mock('react-native-reanimated', () => {
  const reactNative = require('react-native');
  return {
    __reanimatedWorkletInit: jest.fn(),
    useSharedValue: jest.fn((v) => ({ value: v })),
    useAnimatedStyle: jest.fn((cb) => cb()),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useDerivedValue: jest.fn((cb) => ({ value: cb() })),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    withTiming: jest.fn((v) => v),
    withSpring: jest.fn((v) => v),
    withDelay: jest.fn((d, v) => v),
    withSequence: jest.fn((...v) => v[0]),
    withRepeat: jest.fn((v) => v),
    cancelAnimation: jest.fn(),
    measure: jest.fn(),
    scrollTo: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(() => ({ factory: jest.fn() })),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    View: reactNative.View,
    Text: reactNative.Text,
    Image: reactNative.Image,
    ScrollView: reactNative.ScrollView,
    createAnimatedComponent: (c) => c,
    interpolate: jest.fn((v, i, o) => v),
    Extrapolate: {
      CLAMP: 'clamp',
      IDENTITY: 'identity',
      EXTEND: 'extend',
    },
  };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(() => Promise.resolve('my-fcm-token')),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    onMessage: jest.fn(),
    onNotificationOpenedApp: jest.fn(),
    getInitialNotification: jest.fn(() => Promise.resolve(null)),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(),
  fetch: jest.fn(),
  useNetInfo: jest.fn(() => ({ isConnected: true })),
}));
