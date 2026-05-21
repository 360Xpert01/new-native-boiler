import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button/Button';
import AppMap from '@components/Map/AppMap';
import { useLocation } from '@hooks/useLocation';
import { useReverseGeocoding } from '@hooks/useReverseGeocoding';
import { useRoute } from '@hooks/useRoute';
import { useAppSelector } from '@store/hooks';
import { selectSocketConnected } from '@store/slices/socketSlice';
import { calculateDistance } from '@utils/helpers';

const HomeScreen = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const isConnected = useAppSelector(selectSocketConnected);

  // Hooks
  const { latitude, longitude, loading: locationLoading, error: locationError, getCurrentLocation } = useLocation();
  const { fetchAddress: fetchUserAddress, loading: userAddressLoading } = useReverseGeocoding(); // ✅ alag instance
  const { fetchAddress: fetchDestAddress, loading: addressLoading } = useReverseGeocoding();    // ✅ alag instance
  const { fetchRoute, loading: routeLoading } = useRoute();

  // State
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [locationTrigger, setLocationTrigger] = useState(0);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [destinationAddress, setDestinationAddress] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: string; lon: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState<{ y: number; height: number }>({ y: 0, height: 0 });

  // Auto-search Suggestions (Google Maps style Autocomplete) with 500ms Debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const lang = i18n.language || 'en';
        const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&limit=5&accept-language=${lang}&countrycodes=pk`;
        const response = await fetch(url, {
          headers: { 'User-Agent': 'ReactNativeBoilerplate/1.0' },
        });
        const json = await response.json();
        if (Array.isArray(json)) {
          setSearchResults(json);
        }
      } catch (err) {
        console.error('Error fetching autocomplete suggestions:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, i18n.language]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const lang = i18n.language || 'en';
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(searchQuery)}&limit=5&accept-language=${lang}&countrycodes=pk`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ReactNativeBoilerplate/1.0' },
      });
      const json = await response.json();
      if (Array.isArray(json)) {
        setSearchResults(json);
      }
    } catch (err) {
      console.error('Error searching location:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const selectSearchResult = (item: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    // Close keyboard so the map camera transition is fully visible
    Keyboard.dismiss();

    setDestination({ latitude: lat, longitude: lon });
    setDestinationAddress(item.display_name);
    setSearchQuery('');
    setSearchResults([]);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const lastFetchedUserCoordsRef = useRef<{ latitude: number | null; longitude: number | null }>({ latitude: null, longitude: null });
  const lastProcessedUserTriggerRef = useRef(0);

  // Initial Location
  useEffect(() => { getCurrentLocation(); }, [getCurrentLocation]);

  // ✅ Route & Destination Logic — null check + cleanup
  useEffect(() => {
    if (!latitude || !longitude || !destination) {
      setRouteCoords(null);
      setDistance(null);
      setDestinationAddress(null);
      return;
    }

    let cancelled = false;

    const updateRoute = async () => {
      const routeData = await fetchRoute(latitude, longitude, destination.latitude, destination.longitude);
      if (!routeData || cancelled) return; // ✅ abort ya unmount

      setRouteCoords(routeData.coords);
      setDistance(routeData.distance);

      const addr = await fetchDestAddress(destination.latitude, destination.longitude);
      if (!cancelled) setDestinationAddress(addr);
    };

    updateRoute();
    return () => { cancelled = true; }; // ✅ cleanup
  }, [latitude, longitude, destination, fetchRoute, fetchDestAddress]);

  // ✅ User Address Logic — cleanup + alag hook use
  useEffect(() => {
    if (!latitude || !longitude) {
      setUserAddress(null);
      return;
    }

    const shouldFetch =
      !lastFetchedUserCoordsRef.current.latitude ||
      locationTrigger > lastProcessedUserTriggerRef.current ||
      calculateDistance(latitude, longitude, lastFetchedUserCoordsRef.current.latitude!, lastFetchedUserCoordsRef.current.longitude!) > 15;

    if (!shouldFetch) return;

    lastProcessedUserTriggerRef.current = locationTrigger;
    lastFetchedUserCoordsRef.current = { latitude, longitude };

    let cancelled = false;

    const updateAddress = async () => {
      const addr = await fetchUserAddress(latitude, longitude); // ✅ alag hook
      if (!cancelled) setUserAddress(addr);
    };

    updateAddress();
    return () => { cancelled = true; }; // ✅ cleanup
  }, [latitude, longitude, locationTrigger, fetchUserAddress]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView ref={scrollViewRef} contentContainerClassName="p-md" scrollEnabled={scrollEnabled} nestedScrollEnabled keyboardShouldPersistTaps="handled">

        {/* Socket Status */}
        <View className={`flex-row items-center p-sm rounded-lg mb-md ${isConnected ? 'bg-success/20' : 'bg-error/20'}`}>
          <View className={`w-2 h-2 rounded-full me-sm ${isConnected ? 'bg-success' : 'bg-error'}`} />
          <Text className={`text-sm font-bold text-start ${isConnected ? 'text-success' : 'text-error'}`}>
            {t('auth.socketStatus')}: {isConnected ? t('auth.socketConnected') : t('auth.socketDisconnected')}
          </Text>
        </View>

        {/* Dashboard Header */}
        <View className="p-lg rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 mb-lg shadow-sm shadow-black/5">
          <View className="flex-row justify-between items-center w-full mb-md pb-md border-b border-gray-100 dark:border-gray-700/50">
            <View className="items-start flex-1">
              <Text className="text-xl font-bold text-black dark:text-white text-start" numberOfLines={1}>
                {t('common.welcome')}, {user?.name || 'User'}!
              </Text>
              <Text className="text-xs mt-xs text-gray-500 dark:text-gray-400 text-start">
                {t('common.today_status')}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between w-full">
            <View className="flex-1 me-sm p-sm rounded-xl bg-gray-50 dark:bg-gray-800/30 items-start border border-gray-100 dark:border-gray-700/50">
              <Text className="text-xxs font-semibold text-gray-500 dark:text-gray-400 text-start">💼 {t('common.tasks')}</Text>
              <Text className="text-lg font-bold mt-xs text-black dark:text-white text-start">12</Text>
            </View>
            <View className="flex-1 ms-sm p-sm rounded-xl bg-gray-50 dark:bg-gray-800/30 items-start border border-gray-100 dark:border-gray-700/50">
              <Text className="text-xxs font-semibold text-gray-500 dark:text-gray-400 text-start">💬 {t('common.messages')}</Text>
              <Text className="text-lg font-bold mt-xs text-black dark:text-white text-start">5</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 mb-lg bg-white dark:bg-gray-800 items-start relative">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">{t('common.location')}</Text>

          {/* Search Location Bar */}
          <View
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              setSearchBarLayout({ y, height });
            }}
            className="w-full mb-md relative z-50"
          >
            <View className="flex-row items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50 px-sm">
              <TextInput
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  if (!text.trim()) setSearchResults([]);
                }}
                onSubmitEditing={handleSearch}
                placeholder={t('common.searchPlaceholder') || 'Search for a location...'}
                placeholderTextColor="#9ca3af"
                className="flex-1 text-sm text-black dark:text-white px-xs py-2 text-start"
              />
              <TouchableOpacity
                onPress={handleSearch}
                className="px-sm py-xs"
                disabled={searchLoading}
              >
                <Text className="text-base">{searchLoading ? '...' : '🔍'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Suggestions List */}
          {searchResults.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: searchBarLayout.y + searchBarLayout.height,
                left: 24, // matching parent padding p-lg (24)
                right: 24, // matching parent padding p-lg (24)
                zIndex: 50,
              }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl shadow-lg max-h-60 overflow-hidden"
            >
              <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectSearchResult(item)}
                    className="p-sm border-b border-gray-100 dark:border-gray-700/50 items-start w-full active:bg-gray-50 dark:active:bg-gray-700/30"
                  >
                    <Text className="text-xs text-gray-700 dark:text-gray-300 text-start leading-4" numberOfLines={2}>
                      📍 {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <AppMap
            latitude={latitude}
            longitude={longitude}
            destination={destination}
            onSelectDestination={setDestination}
            routeCoords={routeCoords}
            locationTrigger={locationTrigger}
            className="mb-md"
            onTouchStart={() => { setScrollEnabled(false); scrollViewRef.current?.setNativeProps({ scrollEnabled: false }); }}
            onTouchEnd={() => { setScrollEnabled(true); scrollViewRef.current?.setNativeProps({ scrollEnabled: true }); }}
          />

          {latitude && longitude ? (
            <View className="mb-sm items-start w-full gap-y-xs">
              <View className="p-sm bg-gray-50 dark:bg-gray-800/40 rounded-lg w-full items-start border border-gray-100 dark:border-gray-800">
                <Text className="text-xs font-bold text-gray-800 dark:text-gray-200 text-start mb-1">🏠 {t('common.myLocation')}:</Text>
                {userAddressLoading
                  ? <Text className="text-xs text-gray-400 text-start italic">Fetching...</Text>
                  : <Text className="text-xs text-gray-650 dark:text-gray-400 text-start leading-4">{userAddress}</Text>
                }
              </View>

              <Text className="text-xxs text-gray-500 dark:text-gray-500 text-start mt-xs">
                📍 {t('common.latitude')}: {latitude.toFixed(6)} | {t('common.longitude')}: {longitude.toFixed(6)}
              </Text>

              {destination && (
                <View className="mt-sm p-md rounded-xl bg-primary/5 border border-primary/10 w-full items-start">
                  <Text className="text-sm font-bold text-primary text-start mb-xs">📍 Destination:</Text>
                  {addressLoading
                    ? <Text className="text-xs text-gray-500 dark:text-gray-400 text-start italic mb-xs">Fetching...</Text>
                    : <Text className="text-xs text-gray-700 dark:text-gray-300 text-start mb-sm leading-4 font-medium">🏠 {destinationAddress}</Text>
                  }
                  {distance !== null && (
                    <View className="flex-row items-center mb-sm bg-primary/10 px-sm py-xs rounded-lg">
                      <Text className="text-xs font-semibold text-primary">
                        🚗 Distance: {distance > 1000 ? `${(distance / 1000).toFixed(2)} km` : `${distance.toFixed(0)} m`}
                      </Text>
                    </View>
                  )}
                  <Button
                    title="Clear Route"
                    onPress={() => { setDestination(null); setDestinationAddress(null); setDistance(null); }}
                    className="mt-xs w-full bg-error"
                  />
                </View>
              )}
            </View>
          ) : locationError ? (
            <Text className="text-sm italic text-error text-start mb-sm">{locationError}</Text>
          ) : (
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-start mb-sm">{t('common.noLocationData')}</Text>
          )}

          <Button
            title={t('common.getLocation')}
            onPress={() => { getCurrentLocation(); setLocationTrigger((prev) => prev + 1); }}
            loading={locationLoading}
            className="w-full"
          />
        </View>

        {/* Recent Activity */}
        <View className="p-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 items-start">
          <Text className="text-lg font-bold mb-md text-black dark:text-white text-start">{t('common.recentActivity')}</Text>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-primary" />
            <Text className="text-md text-black dark:text-white text-start">{t('common.loginSuccess')}</Text>
          </View>
          <View className="flex-row items-center mb-sm">
            <View className="w-2 h-2 rounded-full me-sm bg-success" />
            <Text className="text-md text-black dark:text-white text-start">{t('common.profileUpdated')}</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default HomeScreen;