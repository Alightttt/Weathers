
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CitySearch from '@/components/CitySearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastSection from '@/components/ForecastSection';
import HourlyChart from '@/components/HourlyChart';
import WeeklyGraph from '@/components/WeeklyGraph';
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
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    loadWeatherData(city);
  };

  const handleAllowLocation = async () => {
    setLocationPrompted(true);
    localStorage.setItem('locationPrompted', 'true');
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
    localStorage.setItem('locationPrompted', 'true');
    // Use the default city
    loadWeatherData(getLastCity());
  };

  useEffect(() => {
    // Check if we've shown the location prompt before
    const hasPrompted = localStorage.getItem('locationPrompted');
    
    if (hasPrompted === 'true') {
      setLocationPrompted(true);
      
      // Check if we already have permission
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            // Permission was already granted, use it directly
            handleAllowLocation();
          } else {
            // Use default city
            loadWeatherData(getLastCity());
          }
        }).catch(() => {
          // Handle error
          loadWeatherData(getLastCity());
        });
      } else {
        loadWeatherData(getLastCity());
      }
    } else {
      setLocationPrompted(false);
    }
  }, []);

  if (!locationPrompted) {
    return (
      <div className={`min-h-screen relative py-8 px-4 transition-colors duration-1000 flex items-center justify-center`}>
        {/* Nature background image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000" 
            alt="Nature background" 
            className="object-cover w-full h-full opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
        </div>
        
        <div className="max-w-md w-full mx-auto relative z-10">
          <GeolocationPrompt 
            onAllowLocation={handleAllowLocation} 
            onDenyLocation={handleDenyLocation} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-6 px-4 transition-colors duration-1000">
      {/* Nature background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000" 
          alt="Nature background" 
          className="object-cover w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-6">
          {currentWeather && (
            <LocationHeader 
              city={currentWeather.name || currentCity} 
              country={currentWeather?.sys?.country || ''}
              onSearch={handleSearch}
            />
          )}
        </div>
        
        <CurrentWeather data={currentWeather} isLoading={isLoading} />
        
        <div className="mt-4">
          <HourlyChart data={forecast} isLoading={isLoading} />
        </div>
        
        <div className="mt-4">
          <WeeklyGraph data={forecast} isLoading={isLoading} />
        </div>
        
        <div className="mt-4 mb-16">
          <ForecastSection data={forecast} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
