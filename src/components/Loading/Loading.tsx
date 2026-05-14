import React from 'react';

import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  Modal,
} from 'react-native';

import { useTheme } from '@theme/ThemeContext';

interface LoadingProps {
  isVisible?: boolean;
  isFullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

const Loading: React.FC<LoadingProps> = ({
  isVisible = true,
  isFullScreen = false,
  size = 'large',
  color,
  style,
}) => {
  const { theme } = useTheme();
  const indicatorColor = color || theme.colors.primary;

  if (!isVisible) return null;

  if (isFullScreen) {
    return (
      <Modal transparent visible={isVisible}>
        <View style={styles.fullScreen}>
          <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            <ActivityIndicator size={size} color={indicatorColor} />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={[styles.inline, style]}>
      <ActivityIndicator size={size} color={indicatorColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inline: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
