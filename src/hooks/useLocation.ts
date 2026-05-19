import { useState, useCallback, useEffect, useRef } from 'react';

import { Platform, PermissionsAndroid, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const requestPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (res === RESULTS.GRANTED) {
        return true;
      } else if (res === RESULTS.DENIED) {
        const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return status === RESULTS.GRANTED;
      }
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    const hasPermission = await requestPermission();

    if (!hasPermission) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Permission denied',
      }));
      return;
    }

    // 1. Get initial position immediately so user doesn't wait
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
        Alert.alert('Location Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    // 2. Clear any existing watch tracking to prevent duplicates
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    // 3. Start real-time continuous GPS tracking subscription
    const watchId = Geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        // Log live tracking errors without annoying standard popup alerts
        console.warn('GPS Live Tracking Error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 3, // Update coordinates every 3 meters of physical movement
        interval: 3000,    // Query physical GPS chip every 3 seconds
        fastestInterval: 1500,
      }
    );

    watchIdRef.current = watchId;
  }, [requestPermission]);

  // Clean up GPS tracking on hook unmount to prevent any battery leaks
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { ...location, getCurrentLocation };
};
