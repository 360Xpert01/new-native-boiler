import React from 'react';

import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView } from 'react-native';

import Button from '@components/Button/Button';
import AppMap from '@components/Map/AppMap';
import { useLocation } from '@hooks/useLocation';
import { useAppSelector } from '@store/hooks';
import { selectSocketConnected } from '@store/slices/socketSlice';
import { useTheme } from '@theme/ThemeContext';

const HomeScreen = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const isConnected = useAppSelector(selectSocketConnected);
  const { latitude, longitude, loading, error, getCurrentLocation } = useLocation();
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [locationTrigger, setLocationTrigger] = React.useState(0);
  const [destination, setDestination] = React.useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = React.useState<[number, number][] | null>(null);

  // Auto-fetch location on mount
  React.useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Fetch actual driving road coordinates from OSRM when destination changes
  React.useEffect(() => {
    if (!latitude || !longitude || !destination) {
      setRouteCoords(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${longitude},${latitude};${destination.longitude},${destination.latitude}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const json = await response.json();

        if (json.code === 'Ok' && json.routes?.[0]?.geometry?.coordinates) {
          setRouteCoords(json.routes[0].geometry.coordinates);
        } else {
          // Fallback to straight line
          setRouteCoords([
            [longitude, latitude],
            [destination.longitude, destination.latitude],
          ]);
        }
      } catch (err) {
        console.error('Error fetching route from OSRM:', err);
        // Fallback to straight line
        setRouteCoords([
          [longitude, latitude],
          [destination.longitude, destination.latitude],
        ]);
      }
    };

    fetchRoute();
  }, [latitude, longitude, destination]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* <Header title={t('common.dashboard')} showBack={false} /> */}
      <ScrollView 
        ref={scrollViewRef}
        contentContainerClassName="p-md" 
        scrollEnabled={scrollEnabled} 
        nestedScrollEnabled
      >
        <View
          className={`flex-row items-center p-sm rounded-lg mb-md ${isConnected ? 'bg-success/20' : 'bg-error/20'
            }`}
        >
          <View
            className={`w-2 h-2 rounded-full me-sm ${isConnected ? 'bg-success' : 'bg-error'
              }`}
          />
          <Text
            className={`text-sm font-bold text-start ${isConnected ? 'text-success' : 'text-error'
              }`}
          >
            {t('auth.socketStatus')}:{' '}
            {isConnected ? t('auth.socketConnected') : t('auth.socketDisconnected')}
          </Text>
        </View>

        <View className="mb-lg items-start">
          <Text className="text-xxl font-bold text-black dark:text-white text-start">
            {t('common.welcome')}, {user?.name || 'User'}!
          </Text>
          <Text className="text-md mt-xs text-gray-600 dark:text-gray-400 text-start">
            {t('common.today_status')}
          </Text>
        </View>

        <View className="flex-row justify-between mb-lg">
          <View className="flex-1 p-md rounded-xl border border-gray-200 dark:border-gray-800 mx-xs bg-white dark:bg-gray-800 items-start">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 text-start">
              {t('common.tasks')}
            </Text>
            <Text className="text-xl font-bold mt-xs text-black dark:text-white text-start">
              12
            </Text>
          </View>
          <View className="flex-1 p-md rounded-xl border border-gray-200 dark:border-gray-800 mx-xs bg-white dark:bg-gray-800 items-start">
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 text-start">
              {t('common.messages')}
            </Text>
            <Text className="text-xl font-bold mt-xs text-black dark:text-white text-start">
              5
            </Text>
          </View>
        </View>

        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 mb-lg bg-white dark:bg-gray-800 items-start">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">
            {t('common.location')}
          </Text>

          <AppMap
            latitude={latitude}
            longitude={longitude}
            destination={destination}
            onSelectDestination={setDestination}
            routeCoords={routeCoords}
            locationTrigger={locationTrigger}
            className="mb-md" // NativeWind class for margin
            onTouchStart={() => {
              setScrollEnabled(false);
              scrollViewRef.current?.setNativeProps({ scrollEnabled: false });
            }}
            onTouchEnd={() => {
              setScrollEnabled(true);
              scrollViewRef.current?.setNativeProps({ scrollEnabled: true });
            }}
          />

          {latitude && longitude ? (
            <View className="mb-sm items-start w-full">
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-start">
                📍 {t('common.latitude')}: {latitude.toFixed(6)} | {t('common.longitude')}: {longitude.toFixed(6)}
              </Text>

              {destination ? (
                <View className="mt-sm p-sm rounded-lg bg-primary/10 border border-primary/20 w-full items-start">
                  <Text className="text-xs font-bold text-primary text-start">
                    Destination Set:
                  </Text>
                  <Text className="text-xs mt-xs text-gray-600 dark:text-gray-400 text-start">
                    Lat: {destination.latitude.toFixed(6)} | Lng: {destination.longitude.toFixed(6)}
                  </Text>
                  <Button
                    title="Clear Route"
                    onPress={() => setDestination(null)}
                    className="mt-xs w-full bg-error"
                  />
                </View>
              ) : (
                ''
              )}
            </View>
          ) : error ? (
            <Text className="text-sm italic text-error text-start mb-sm">{error}</Text>
          ) : (
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-start mb-sm">
              {t('common.noLocationData')}
            </Text>
          )}

          <Button
            title={t('common.getLocation')}
            onPress={() => {
              getCurrentLocation();
              setLocationTrigger((prev) => prev + 1);
            }}
            loading={loading}
            className="w-full"
          />
        </View>

        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 items-start">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">
            {t('common.recentActivity')}
          </Text>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-primary" />
            <Text className="text-md text-black dark:text-white text-start">
              {t('common.loginSuccess')}
            </Text>
          </View>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-success" />
            <Text className="text-md text-black dark:text-white text-start">
              {t('common.profileUpdated')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
