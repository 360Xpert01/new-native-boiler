import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const cache = new Map<string, string>(); // module-level cache

export const useReverseGeocoding = () => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const langRef = useRef(i18n.language);

  // ref update karo taake fetchAddress recreate na ho
  langRef.current = i18n.language;

  const fetchAddress = useCallback(async (latitude: number, longitude: number) => {
    // 4 decimal places kaafi hain (~11m accuracy)
    const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)},${langRef.current}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    setLoading(true);
    try {
      const lang = langRef.current || 'en';
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${lang}`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'ReactNativeBoilerplate/1.0' },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();
      const address = json.display_name || 'Address not found';

      cache.set(cacheKey, address);
      return address;
    } catch (err) {
      console.error('Error in useReverseGeocoding:', err);
      return 'Could not fetch address';
    } finally {
      setLoading(false);
    }
  }, []); // ab dependency nahi

  return { fetchAddress, loading };
};