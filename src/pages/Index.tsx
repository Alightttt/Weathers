
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CitySearch from '@/components/CitySearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import HourlyChart from '@/components/HourlyChart';
import LocationHeader from '@/components/LocationHeader';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  getLastCity, 
  saveLastCity, 
  WeatherData, 
  ForecastData,
  getWeatherBackground
} from '@/lib/weather-utils';

const Index = () => {
  const { toast } = useToast();
  const [currentCity, setCurrentCity] = useState<string>(getLastCity());
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bgGradient, setBgGradient] = useState<string>("from-gray-900 to-gray-800");

  const loadWeatherData = async (city: string) => {
    setIsLoading(true);

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city)
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setCurrentCity(city);
      saveLastCity(city);

      // Set background gradient based on weather condition
      if (weatherData.weather && weatherData.weather[0]) {
        setBgGradient(getWeatherBackground(weatherData.weather[0].main));
      }

      toast({
        title: "Weather Updated",
        description: `Latest weather data for ${city} has been loaded`,
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      toast({
        title: "Error",
        description: `Failed to load weather data for ${city}. Please check the city name and try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    loadWeatherData(city);
  };

  useEffect(() => {
    loadWeatherData(currentCity);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} py-8 px-4 transition-colors duration-1000`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <CitySearch onSearch={handleSearch} defaultCity={currentCity} />
        </div>
        
        {currentWeather && (
          <LocationHeader 
            city={currentWeather.name} 
            country={currentWeather.sys?.country || ''}
          />
        )}
        
        <CurrentWeather data={currentWeather as WeatherData} isLoading={isLoading} />
        
        <ForecastSection data={forecast as ForecastData} isLoading={isLoading} />
        
        <HourlyChart data={forecast as ForecastData} isLoading={isLoading} />
        
        <div className="mt-8 text-center text-sm text-white/40">
          <p>Data provided by OpenWeatherMap</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
