import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme as useReactNativeColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

import { darkTheme } from './darkTheme';
import { lightTheme, Theme } from './lightTheme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useReactNativeColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setColorScheme(mode);
  };

  const isDark = useMemo(() => {
    return themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const contextValue = useMemo(() => ({
    theme,
    themeMode,
    setThemeMode,
    isDark,
  }), [theme, themeMode, isDark]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

