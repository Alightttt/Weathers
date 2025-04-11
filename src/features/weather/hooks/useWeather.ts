
import { useState, useCallback } from 'react';
import { WeatherData, ForecastData } from '../types/weather';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  getUserCoordinates,
  saveLastCity,
  getLastCity,
  Coordinates 
} from '../services/weatherService';
import { useToast } from '@/hooks/use-toast';

export const useWeather = () => {
  const [currentCity, setCurrentCity] = useState<string>(getLastCity());
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bgGradient, setBgGradient] = useState<string>("from-gray-950 to-gray-900");
  const { toast } = useToast();

  const loadWeatherData = useCallback(async (city: string, coords?: Coordinates) => {
    setIsLoading(true);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, coords),
        fetchForecast(city, coords)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(weatherData.name || city);
      saveLastCity(weatherData.name || city);

      // Set background gradient based on weather condition
      if (weatherData.weather && weatherData.weather[0]) {
        const condition = weatherData.weather[0].main;
        switch (condition) {
          case 'Clear':
            setBgGradient('from-blue-400 to-blue-600');
            break;
          case 'Clouds':
            setBgGradient('from-gray-400 to-slate-600');
            break;
          case 'Rain':
          case 'Drizzle':
            setBgGradient('from-gray-600 to-gray-800');
            break;
          case 'Thunderstorm':
            setBgGradient('from-gray-800 to-gray-950');
            break;
          case 'Snow':
            setBgGradient('from-slate-200 to-slate-400');
            break;
          case 'Mist':
          case 'Fog':
          case 'Haze':
            setBgGradient('from-gray-400 to-gray-600');
            break;
          default:
            setBgGradient('from-gray-950 to-gray-900');
        }
      }

      toast({
        title: "Weather Updated",
        description: `Latest weather data for ${weatherData.name || city} has been loaded`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: `Failed to load weather data. Please try again later.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleLocationAccess = useCallback(async () => {
    try {
      const coords = await getUserCoordinates();
      loadWeatherData("", coords); // Empty city string as we'll get it from coords
      return true;
    } catch (error) {
      console.error('Error getting user coordinates:', error);
      // Fall back to last city or Berlin
      loadWeatherData(getLastCity());
      return false;
    }
  }, [loadWeatherData]);

  const handleSearch = useCallback((city: string) => {
    loadWeatherData(city);
  }, [loadWeatherData]);

  return {
    currentCity,
    currentWeather,
    forecast,
    isLoading,
    bgGradient,
    handleSearch,
    handleLocationAccess
  };
};
