import React from 'react';

import { Map, Camera, ViewAnnotation, CameraRef, GeoJSONSource, Layer } from '@maplibre/maplibre-react-native';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@theme/ThemeContext';

// MapLibre doesn't require an access token for public styles.

interface AppMapProps {
  latitude?: number | null;
  longitude?: number | null;
  zoomLevel?: number;
  style?: ViewStyle;
  showMarker?: boolean;
  className?: string;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  destination?: { latitude: number; longitude: number } | null;
  onSelectDestination?: (coords: { latitude: number; longitude: number } | null) => void;
  routeCoords?: [number, number][] | null;
  locationTrigger?: number;
}

const AppMap: React.FC<AppMapProps> = ({
  latitude,
  longitude,
  zoomLevel = 15,
  style,
  showMarker = true,
  className,
  onTouchStart,
  onTouchEnd,
  destination,
  onSelectDestination,
  routeCoords,
  locationTrigger = 0,
}) => {
  const { isDark } = useTheme();
  const cameraRef = React.useRef<CameraRef>(null);

  const mapStyle = isDark
    ? 'https://tiles.openfreemap.org/styles/dark'
    : 'https://tiles.openfreemap.org/styles/bright';

  // Default to Islamabad coordinates if none provided
  const centerCoordinate: [number, number] =
    longitude && latitude ? [longitude, latitude] : [73.0479, 33.6844];

  // Define GeoJSON shape for the route line
  const routeGeoJson = React.useMemo(() => {
    if (!routeCoords || routeCoords.length === 0) return null;
    return {
      type: 'Feature' as const,
      properties: {},
      geometry: {
        type: 'LineString' as const,
        coordinates: routeCoords,
      },
    };
  }, [routeCoords]);

  const lastProcessedTriggerRef = React.useRef(0);
  const waitingForCoordsRef = React.useRef(false);
  const prevCoordsRef = React.useRef<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });

  // Fly to location smoothly on initial mount, or when explicitly requested by locationTrigger
  React.useEffect(() => {
    if (!latitude || !longitude || !cameraRef.current) return;

    const isInitial = prevCoordsRef.current.latitude === null;
    const triggerChanged = locationTrigger > lastProcessedTriggerRef.current;

    if (triggerChanged) {
      lastProcessedTriggerRef.current = locationTrigger;
      waitingForCoordsRef.current = true;
      cameraRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 2000,
      });
    } else if (waitingForCoordsRef.current) {
      waitingForCoordsRef.current = false;
      cameraRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 2000,
      });
    } else if (isInitial) {
      cameraRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 15,
        duration: 2000,
      });
    }

    prevCoordsRef.current = { latitude, longitude };
  }, [latitude, longitude, locationTrigger]);

  return (
    <View 
      style={[styles.container, style]} 
      className={className}
      onStartShouldSetResponderCapture={() => {
        onTouchStart?.();
        return false;
      }}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <Map
        style={styles.map}
        mapStyle={mapStyle}
        logo={false}
        attribution={false}
        androidView="texture"
        onPress={(event: any) => {
          const coords = event.nativeEvent?.lngLat;
          if (coords) {
            onSelectDestination?.({
              longitude: coords[0],
              latitude: coords[1],
            });
          }
        }}
      >
        <Camera
          ref={cameraRef}
          initialViewState={{
            center: centerCoordinate,
            zoom: zoomLevel,
          }}
        />

        {/* Draw a gorgeous routing line between current position and destination */}
        {routeGeoJson && (
          <GeoJSONSource id="routeSource" data={routeGeoJson}>
            <Layer
              id="routeLine"
              type="line"
              paint={{
                'line-color': '#3b82f6', // beautiful glowing blue line
                'line-width': 4,
                'line-opacity': 0.8,
              }}
              layout={{
                'line-cap': 'round',
                'line-join': 'round',
              }}
            />
          </GeoJSONSource>
        )}

        {showMarker && (
          <ViewAnnotation
            id="userLocation"
            lngLat={centerCoordinate}
          >
            <View className="items-center justify-center w-8 h-8">
              {/* Outer soft glow ring */}
              <View className="absolute w-7 h-7 bg-primary/20 rounded-full" />
              {/* Mid ring */}
              <View className="absolute w-5 h-5 bg-primary/30 rounded-full border border-primary/20" />
              {/* Inner core solid blue dot */}
              <View className="w-3.5 h-3.5 bg-primary rounded-full border-2 border-white shadow-md shadow-primary/50" />
            </View>
          </ViewAnnotation>
        )}

        {/* Place a beautiful glowing RED destination marker */}
        {destination && (
          <ViewAnnotation
            id="destinationLocation"
            lngLat={[destination.longitude, destination.latitude]}
          >
            <View className="items-center justify-center w-8 h-8">
              {/* Outer soft glow ring (Red) */}
              <View className="absolute w-7 h-7 bg-red-500/20 rounded-full" />
              {/* Mid ring */}
              <View className="absolute w-5 h-5 bg-red-500/30 rounded-full border border-red-500/20" />
              {/* Inner core solid red dot */}
              <View className="w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white shadow-md shadow-red-500/50" />
            </View>
          </ViewAnnotation>
        )}
      </Map>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  map: {
    flex: 1,
  },
});

export default AppMap;
