
import React, { useState, useEffect } from 'react';
import { useWeather } from '@/features/weather/hooks/useWeather';
import WeatherLayout from '@/components/layout/WeatherLayout';
import WeatherHeader from '@/features/weather/components/WeatherHeader';
import WeatherDashboard from '@/features/weather/components/WeatherDashboard';
import LocationPrompt from '@/features/location/components/LocationPrompt';

const WeatherPage: React.FC = () => {
  const {
    currentCity,
    currentWeather,
    forecast,
    isLoading,
    bgGradient,
    handleSearch,
    handleLocationAccess
  } = useWeather();
  const [locationPrompted, setLocationPrompted] = useState<boolean>(false);

  useEffect(() => {
    // On first load, check if we already have permission
    const checkForLocation = async () => {
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          
          if (result.state === 'granted') {
            // Permission was already granted, use it directly
            setLocationPrompted(true);
            await handleLocationAccess();
          } else if (result.state === 'prompt') {
            // We need to ask for permission
            setLocationPrompted(false);
          } else {
            // Permission was denied previously
            setLocationPrompted(true);
            handleSearch(currentCity);
          }
        } catch (error) {
          console.error('Error checking location permissions:', error);
          setLocationPrompted(true);
          handleSearch(currentCity);
        }
      } else {
        // Browsers that don't support the permissions API
        setLocationPrompted(false);
      }
    };

    checkForLocation();
  }, [currentCity, handleLocationAccess, handleSearch]);

  const handleAllowLocation = async () => {
    setLocationPrompted(true);
    await handleLocationAccess();
  };

  const handleDenyLocation = () => {
    setLocationPrompted(true);
    handleSearch(currentCity);
  };

  if (!locationPrompted) {
    return (
      <WeatherLayout bgGradient="from-blue-400 to-blue-800">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full mx-auto">
            <LocationPrompt 
              onAllowLocation={handleAllowLocation}
              onDenyLocation={handleDenyLocation}
            />
          </div>
        </div>
      </WeatherLayout>
    );
  }

  return (
    <WeatherLayout bgGradient={bgGradient}>
      {currentWeather && (
        <WeatherHeader 
          city={currentWeather.name || currentCity} 
          country={currentWeather.sys?.country || ''} 
          onSearch={handleSearch} 
        />
      )}

      <WeatherDashboard
        currentWeather={currentWeather}
        forecast={forecast}
        isLoading={isLoading}
      />
    </WeatherLayout>
  );
};

export default WeatherPage;
