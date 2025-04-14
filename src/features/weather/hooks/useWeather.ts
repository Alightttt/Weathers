
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
  const [bgGradient, setBgGradient] = useState<string>("from-gray-950 to-gray-900");

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

      // Set background gradient based on weather condition
      if (weatherData.weather && weatherData.weather[0]) {
        const condition = weatherData.weather[0].main;
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        switch (condition) {
          case 'Clear':
            setBgGradient(isDarkMode ? 'from-blue-600 to-blue-800' : 'from-blue-400 to-blue-600');
            break;
          case 'Clouds':
            setBgGradient(isDarkMode ? 'from-gray-600 to-slate-700' : 'from-gray-400 to-slate-500');
            break;
          case 'Rain':
          case 'Drizzle':
            setBgGradient(isDarkMode ? 'from-gray-700 to-gray-900' : 'from-gray-500 to-gray-700');
            break;
          case 'Thunderstorm':
            setBgGradient(isDarkMode ? 'from-gray-900 to-purple-900' : 'from-gray-700 to-purple-700');
            break;
          case 'Snow':
            setBgGradient(isDarkMode ? 'from-slate-300 to-slate-500' : 'from-slate-200 to-slate-400');
            break;
          case 'Mist':
          case 'Fog':
          case 'Haze':
            setBgGradient(isDarkMode ? 'from-gray-600 to-gray-800' : 'from-gray-400 to-gray-600');
            break;
          default:
            setBgGradient(isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-600 to-gray-700');
        }
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

  // Listen for theme changes to update the weather display
  useEffect(() => {
    const handleThemeChange = () => {
      if (currentWeather?.weather?.[0]) {
        const condition = currentWeather.weather[0].main;
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        // Update background based on current condition and theme
        switch (condition) {
          case 'Clear':
            setBgGradient(isDarkMode ? 'from-blue-600 to-blue-800' : 'from-blue-400 to-blue-600');
            break;
          case 'Clouds':
            setBgGradient(isDarkMode ? 'from-gray-600 to-slate-700' : 'from-gray-400 to-slate-500');
            break;
          case 'Rain':
          case 'Drizzle':
            setBgGradient(isDarkMode ? 'from-gray-700 to-gray-900' : 'from-gray-500 to-gray-700');
            break;
          case 'Thunderstorm':
            setBgGradient(isDarkMode ? 'from-gray-900 to-purple-900' : 'from-gray-700 to-purple-700');
            break;
          case 'Snow':
            setBgGradient(isDarkMode ? 'from-slate-300 to-slate-500' : 'from-slate-200 to-slate-400');
            break;
          case 'Mist':
          case 'Fog':
          case 'Haze':
            setBgGradient(isDarkMode ? 'from-gray-600 to-gray-800' : 'from-gray-400 to-gray-600');
            break;
          default:
            setBgGradient(isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-600 to-gray-700');
        }
      }
    };
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, [currentWeather]);

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
