
import { useState, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { WeatherData, ForecastData } from '../types/weather';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  getUserCoordinates,
  saveLastCity,
  getLastCity,
  Coordinates 
} from '../services/weatherService';

export const useWeather = () => {
  const [currentCity, setCurrentCity] = useState<string>(getLastCity() || "New York");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadWeatherData = useCallback(async (city: string, coords?: Coordinates) => {
    setIsLoading(true);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, coords),
        fetchForecast(city, coords)
      ]);

      // Ensure temperature values are correct
      if (weatherData.main && typeof weatherData.main.temp === 'number') {
        weatherData.main.temp = Math.round(weatherData.main.temp);
      }
      if (weatherData.main && typeof weatherData.main.feels_like === 'number') {
        weatherData.main.feels_like = Math.round(weatherData.main.feels_like);
      }
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      
      // Update city name from the weather data
      if (weatherData.name) {
        setCurrentCity(weatherData.name);
        saveLastCity(weatherData.name);
      }
      
      return true;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast.error('Could not fetch weather data. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationAccess = useCallback(async () => {
    try {
      setIsLoading(true);
      const coords = await getUserCoordinates();
      const success = await loadWeatherData("", coords); // Empty city string as we'll get it from coords
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error getting user coordinates:', error);
      // Fall back to last city or New York
      await loadWeatherData(getLastCity() || "New York");
      return false;
    }
  }, [loadWeatherData]);

  const handleSearch = useCallback((city: string) => {
    if (!city.trim()) return;
    loadWeatherData(city);
  }, [loadWeatherData]);

  // Initial data loading
  useEffect(() => {
    const initialLoad = async () => {
      if (!currentWeather) {
        await loadWeatherData(currentCity || "New York");
      }
    };

    initialLoad();
  }, [currentCity, currentWeather, loadWeatherData]);

  return {
    currentCity,
    currentWeather,
    forecast,
    isLoading,
    handleSearch,
    handleLocationAccess
  };
};
