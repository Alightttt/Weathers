
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CurrentWeather from '@/components/CurrentWeather';
import WeeklyGraph from '@/components/WeeklyGraph';
import LocationHeader from '@/components/LocationHeader';
import GeolocationPrompt from '@/components/GeolocationPrompt';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  getUserCoordinates,
  getLastCity, 
  saveLastCity
} from '@/lib/weather-utils';
import { WeatherData, ForecastData } from '@/features/weather/types/weather';

const Index = () => {
  const { toast } = useToast();
  const [currentCity, setCurrentCity] = useState<string>(getLastCity());
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#f2f2f2]">
        <div className="max-w-md w-full mx-auto">
          <GeolocationPrompt 
            onAllowLocation={handleAllowLocation} 
            onDenyLocation={handleDenyLocation} 
          />
        </div>
      </div>
    );
  }

  const weatherCondition = currentWeather?.weather?.[0]?.main || "Clear";
  const temperature = currentWeather?.current?.temperature_2m || 
                     (currentWeather?.main?.temp !== undefined ? Math.round(currentWeather.main.temp) : 0);

  return (
    <div className="min-h-screen bg-[#FFDE5F] py-6 px-4 transition-colors duration-1000">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          {currentWeather && (
            <LocationHeader 
              city={currentWeather.name || currentCity} 
              country={currentWeather?.sys?.country || ''}
              temperature={temperature}
              condition={weatherCondition}
              onSearch={handleSearch}
            />
          )}
        </div>
        
        <CurrentWeather data={currentWeather} isLoading={isLoading} />
        
        <div className="mt-6">
          <WeeklyGraph data={forecast} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
