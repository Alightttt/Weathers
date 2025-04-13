
import { useState, useCallback, useEffect } from 'react';
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
  const [bgGradient, setBgGradient] = useState<string>("from-gray-950 to-gray-900");

  const loadWeatherData = useCallback(async (city: string, coords?: Coordinates) => {
    setIsLoading(true);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, coords),
        fetchForecast(city, coords)
      ]);

      // Ensure temperature values are correct - no +1 degree discrepancy
      if (weatherData.main && typeof weatherData.main.temp === 'number') {
        weatherData.main.temp = Math.round(weatherData.main.temp);
      }
      if (weatherData.main && typeof weatherData.main.feels_like === 'number') {
        weatherData.main.feels_like = Math.round(weatherData.main.feels_like);
      }
      
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
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationAccess = useCallback(async () => {
    try {
      setIsLoading(true);
      const coords = await getUserCoordinates();
      await loadWeatherData("", coords); // Empty city string as we'll get it from coords
      return true;
    } catch (error) {
      console.error('Error getting user coordinates:', error);
      // Fall back to last city or New York
      loadWeatherData(getLastCity() || "New York");
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
        loadWeatherData(currentCity || "New York");
      }
    };

    initialLoad();
  }, [currentCity, currentWeather, loadWeatherData]);

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
