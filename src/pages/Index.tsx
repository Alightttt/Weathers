
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CitySearch from '@/components/CitySearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import HourlyChart from '@/components/HourlyChart';
import LocationHeader from '@/components/LocationHeader';
import GeolocationPrompt from '@/components/GeolocationPrompt';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  getUserCoordinates,
  getLastCity, 
  saveLastCity, 
  getWeatherBackground
} from '@/lib/weather-utils';
import { WeatherData, ForecastData } from '@/features/weather/types/weather';

const Index = () => {
  const { toast } = useToast();
  const [currentCity, setCurrentCity] = useState<string>(getLastCity());
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bgGradient, setBgGradient] = useState<string>("from-gray-950 to-gray-900");
  const [locationPrompted, setLocationPrompted] = useState<boolean>(false);

  const loadWeatherData = async (city: string, coords?: {latitude: number, longitude: number}) => {
    setIsLoading(true);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, coords),
        fetchForecast(city, coords)
      ]);

      setCurrentWeather(weatherData as WeatherData);
      setForecast(forecastData as ForecastData);
      setCurrentCity(weatherData.name || city);
      saveLastCity(weatherData.name || city);

      // Set background gradient based on weather condition
      if (weatherData.weather && weatherData.weather[0]) {
        setBgGradient(getWeatherBackground(weatherData.weather[0].main));
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
  };

  const handleSearch = (city: string) => {
    loadWeatherData(city);
  };

  const handleAllowLocation = async () => {
    setLocationPrompted(true);
    try {
      const coords = await getUserCoordinates();
      loadWeatherData("", coords); // Empty city string as we'll get it from coords
    } catch (error) {
      console.error('Error getting user coordinates:', error);
      // Fall back to last city or Berlin
      loadWeatherData(getLastCity());
    }
  };

  const handleDenyLocation = () => {
    setLocationPrompted(true);
    // Use the default city
    loadWeatherData(getLastCity());
  };

  useEffect(() => {
    // On first load, prompt for location
    const checkForLocation = () => {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            // Permission was already granted, use it directly
            handleAllowLocation();
          } else if (result.state === 'prompt') {
            // We need to ask for permission
            setLocationPrompted(false);
          } else {
            // Permission was denied previously
            handleDenyLocation();
          }
        });
      } else {
        // Browsers that don't support the permissions API
        setLocationPrompted(false);
      }
    };

    checkForLocation();
  }, []);

  if (!locationPrompted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 py-8 px-4 transition-colors duration-1000 flex items-center justify-center`}>
        <div className="max-w-md w-full mx-auto">
          <GeolocationPrompt 
            onAllowLocation={handleAllowLocation} 
            onDenyLocation={handleDenyLocation} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} py-8 px-4 transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div className="flex-1">
            {currentWeather && (
              <LocationHeader 
                city={currentWeather.name || currentCity} 
                country={currentWeather?.sys?.country || ''}
              />
            )}
          </div>
          <div className="w-full md:w-64">
            <CitySearch onSearch={handleSearch} defaultCity={currentCity} />
          </div>
        </div>
        
        <CurrentWeather data={currentWeather} isLoading={isLoading} />
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white/80 mb-2">Hourly Forecast</h3>
          <HourlyChart data={forecast} isLoading={isLoading} />
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white/80 mb-2">5-Day Forecast</h3>
          <ForecastSection data={forecast} isLoading={isLoading} />
        </div>
        
        <div className="mt-8 text-center text-sm text-white/40">
          <p>Data provided by Open-Meteo</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
