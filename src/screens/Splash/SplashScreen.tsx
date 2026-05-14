import React, { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  Easing
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '@constants/fonts';
import { useAppDispatch } from '@store/hooks';
import { setAppReady } from '@store/slices/appSlice';
import { useTheme } from '@theme/ThemeContext';

const SplashScreen = () => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();

  // Animation shared values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  useEffect(() => {
    // Start animations
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 1000 });
    
    textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
    textTranslateY.value = withDelay(500, withSpring(0));

    const init = async () => {
      // Wait for animations to complete + extra delay for effect
      await new Promise((resolve) => setTimeout(resolve, 3000));
      dispatch(setAppReady(true));
    };

    init();
  }, [dispatch, scale, opacity, textOpacity, textTranslateY]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.iconContainer, iconStyle]}>
        <Icon name="rocket-launch" size={100} color={theme.colors.primary} />
      </Animated.View>
      
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Animated.Text style={[styles.appName, { color: theme.colors.text }]}>
          BoilerPlate
        </Animated.Text>
        <Animated.Text style={[styles.tagline, { color: theme.colors.secondaryText }]}>
          Build Something Amazing
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
    opacity: 0.8,
  },
});

export default SplashScreen;
