import { useState, useCallback, useRef } from 'react';
import { calculateDistance } from '@utils/helpers';

type RouteResult = {
  coords: [number, number][];
  distance: number;
  isFallback: boolean; // ab caller ko pata chalega
};

export const useRoute = () => {
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchRoute = useCallback(async (
    startLat: number,
    startLon: number,
    endLat: number,
    endLon: number
  ): Promise<RouteResult> => {
    // pehli request cancel karo agar chal rahi ho
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;
      
      const response = await fetch(url, {
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      if (json.code === 'Ok' && json.routes?.[0]) {
        return {
          coords: json.routes[0].geometry.coordinates as [number, number][],
          distance: json.routes[0].distance as number,
          isFallback: false,
        };
      }

      throw new Error('No routes found');
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err; // abort ko quietly handle karo

      console.error('Error in useRoute:', err);
      return {
        coords: [[startLon, startLat], [endLon, endLat]],
        distance: calculateDistance(startLat, startLon, endLat, endLon),
        isFallback: true,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchRoute, loading };
};