import React, { useEffect, useState } from 'react';

import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '@constants/fonts';
import { spacing } from '@constants/spacing';
import { useTheme } from '@theme/ThemeContext';


const NetworkStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected === false) {
        setIsVisible(true);
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (state.isConnected === true && isVisible) {
        Animated.timing(animatedValue, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }
    });

    return () => unsubscribe();
  }, [animatedValue, isVisible]);

  if (!isVisible && isConnected) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isConnected ? theme.colors.success : theme.colors.error,
          transform: [{ translateY: animatedValue }],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon
          name={isConnected ? 'wifi' : 'wifi-off'}
          size={20}
          color={theme.colors.primaryText}
        />
        <Text style={[styles.text, { color: theme.colors.primaryText }]}>
          {isConnected ? 'Back Online' : 'No Internet Connection'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingTop: spacing.xl, // Assuming some safe area
    paddingBottom: spacing.xs,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  text: {
    marginLeft: spacing.sm,
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.medium,
  },
});

export default NetworkStatus;
