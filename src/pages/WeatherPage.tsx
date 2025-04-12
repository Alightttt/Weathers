
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
    // Check if we've shown the location prompt before
    const hasPrompted = localStorage.getItem('locationPrompted');
    
    if (hasPrompted === 'true') {
      setLocationPrompted(true);
      
      // Check if we already have permission
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            // Permission was already granted, use it
            handleLocationAccess();
          } else {
            // Use default city - New York
            handleSearch('New York');
          }
        }).catch(() => {
          // Handle error
          handleSearch('New York');
        });
      } else {
        handleSearch('New York');
      }
    } else {
      setLocationPrompted(false);
    }
  }, [handleLocationAccess, handleSearch]);

  const handleAllowLocation = async () => {
    setLocationPrompted(true);
    localStorage.setItem('locationPrompted', 'true');
    await handleLocationAccess();
  };

  const handleDenyLocation = () => {
    setLocationPrompted(true);
    localStorage.setItem('locationPrompted', 'true');
    handleSearch('New York');
  };

  if (!locationPrompted) {
    return (
      <WeatherLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="max-w-md w-full mx-auto">
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
